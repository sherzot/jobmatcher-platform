import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { requestPath, resolveRequestId } from './common/http/request-metadata';

async function bootstrap() {
  const configuredLevels = (process.env.LOG_LEVELS ?? 'error,warn,log')
    .split(',')
    .map((level) => level.trim())
    .filter((level): level is 'log' | 'error' | 'warn' | 'debug' | 'verbose' =>
      ['log', 'error', 'warn', 'debug', 'verbose'].includes(level),
    );
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: configuredLevels,
  });

  // ── Prefix ──────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // ── Cookie parser ────────────────────────────────────────────
  app.use(cookieParser());

  app.use((req: Request, res: Response, next: NextFunction) => {
    const incoming = req.header('x-request-id');
    const requestId = resolveRequestId(incoming);
    res.setHeader('X-Request-ID', requestId);
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (requestPath(req) === '/api/health') return next();
    const startedAt = Date.now();
    res.on('finish', () => {
      const requestId = String(res.getHeader('X-Request-ID') ?? 'unknown');
      logger.log(
        JSON.stringify({
          event: 'http.request',
          requestId,
          method: req.method,
          path: requestPath(req),
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
        }),
      );
    });
    next();
  });

  // ── CORS ─────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ── Global validation pipe ───────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // auto-transform types (e.g. string → number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger (dev only) ────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('JobMatch API')
      .setDescription('JobMatch Platform — REST API')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`🚀 API running on http://localhost:${port}/api`);
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }
}

void bootstrap();
