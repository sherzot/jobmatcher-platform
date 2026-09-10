import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
type HttpRequest = {
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  header?: (name: string) => string | undefined;
};

type HttpResponse = {
  getHeader?: (name: string) => unknown;
  status: (code: number) => HttpResponse;
  json?: (body: unknown) => unknown;
  send?: (body: unknown) => unknown;
};

function normalizeRequestId(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return value;
  if (
    Array.isArray(value) &&
    typeof value[0] === 'string' &&
    value[0].length > 0
  ) {
    return value[0];
  }
  return 'unknown';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();
    const request = ctx.getRequest<HttpRequest>();
    const requestId = normalizeRequestId(
      response.getHeader?.('X-Request-ID') ??
        request.header?.('x-request-id') ??
        request.headers?.['x-request-id'] ??
        'unknown',
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        code =
          (res.code as string) ??
          exception.constructor.name.replace('Exception', '').toUpperCase();
        message = (res.message as string) ?? exception.message;

        // Handle class-validator array of errors
        if (Array.isArray(res.message)) {
          message = (res.message as string[]).join(', ');
        }
      } else {
        message = exceptionResponse;
        code = exception.constructor.name
          .replace('Exception', '')
          .toUpperCase();
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        JSON.stringify({
          event: 'http.exception',
          requestId,
          message: exception.message,
          stack: exception.stack,
        }),
      );
    }

    const payload = {
      success: false,
      error: {
        code,
        message,
        path: request.url ?? '/',
        requestId,
        timestamp: new Date().toISOString(),
      },
    };
    const output = response.status(status);
    if (output.json) {
      output.json(payload);
    } else if (output.send) {
      output.send(payload);
    }
  }
}
