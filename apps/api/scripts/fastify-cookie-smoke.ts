import { Controller, Get, Module, Res } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { configureFastifyApp } from '../src/fastify-bootstrap';
import {
  writeAuthCookie,
  type AuthCookieResponse,
} from '../src/common/http/auth-cookie';

@Controller('session')
class SessionSmokeController {
  @Get()
  session(@Res({ passthrough: true }) response: AuthCookieResponse) {
    writeAuthCookie(response, 'access_token', 'runtime-smoke-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60,
      path: '/',
    });
    return { status: 'ok' };
  }
}

@Module({ controllers: [SessionSmokeController] })
class SessionSmokeModule {}

async function main(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    SessionSmokeModule,
    new FastifyAdapter({ logger: false }),
  );
  await configureFastifyApp(app);
  await app.init();

  const response = await app.getHttpAdapter().getInstance().inject({
    method: 'GET',
    url: '/api/session',
    headers: { origin: 'http://localhost:3000' },
  });
  const cookies = response.headers['set-cookie'];

  if (
    response.statusCode !== 200 ||
    typeof cookies !== 'string' ||
    !cookies.includes('access_token=runtime-smoke-token') ||
    response.headers['x-content-type-options'] !== 'nosniff' ||
    response.headers['access-control-allow-origin'] !== 'http://localhost:3000'
  ) {
    throw new Error(`Fastify cookie smoke failed: ${response.statusCode} ${String(cookies)}`);
  }


  await app.close();
  console.log('Fastify cookie smoke passed');
}

void main();
