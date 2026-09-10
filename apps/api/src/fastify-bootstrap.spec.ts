import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { configureFastifyApp } from './fastify-bootstrap';

@Controller('health')
class SmokeController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}

@Module({ controllers: [SmokeController] })
class SmokeModule {}

describe('Fastify bootstrap', () => {
  it('serves a prefixed route and propagates request ID', async () => {
    const app = await NestFactory.create<NestFastifyApplication>(
      SmokeModule,
      new FastifyAdapter({ logger: false }),
    );

    // @fastify/cookie uses a dynamic import that Jest's CommonJS VM cannot load.
    await configureFastifyApp(app, { registerCookie: false });
    await app.init();

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: 'GET',
        url: '/api/health',
        headers: { 'x-request-id': 'fastify-smoke-id' },
      });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBe('fastify-smoke-id');
    expect(response.json()).toEqual({ status: 'ok' });

    await app.close();
  });
});
