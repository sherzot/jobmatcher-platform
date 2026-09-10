import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = String(
      response.getHeader('X-Request-ID') ??
        request.header('x-request-id') ??
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

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        path: request.url,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
