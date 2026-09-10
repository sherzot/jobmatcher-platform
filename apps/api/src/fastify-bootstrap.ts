import { Logger, ValidationPipe } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import { requestPath, resolveRequestId } from './common/http/request-metadata';

export async function configureFastifyApp(
  app: NestFastifyApplication,
  options: { registerCookie?: boolean } = {},
): Promise<void> {
  const logger = new Logger('FastifyBootstrap');

  if (options.registerCookie !== false) {
    await app.register(cookie);
  }
  await app.register(helmet, {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onRequest', async (request, reply) => {
    const incoming = request.headers['x-request-id'];
    const requestId = resolveRequestId(
      Array.isArray(incoming) ? incoming[0] : incoming,
    );
    reply.header('X-Request-ID', requestId);
  });
  fastify.addHook('onResponse', async (request, reply) => {
    if (requestPath(request) === '/api/health') return;
    logger.log(
      JSON.stringify({
        event: 'http.request',
        requestId: reply.getHeader('X-Request-ID') ?? 'unknown',
        method: request.method,
        path: requestPath(request),
        statusCode: reply.statusCode,
      }),
    );
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });
}
