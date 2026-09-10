import { Test } from '@nestjs/testing';
import {
  type NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { configureFastifyApp } from '../src/fastify-bootstrap';
import { ThrottlerStorage } from '@nestjs/throttler';

describe('Fastify AppModule (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(
      new FastifyAdapter({ logger: false }),
    );
    await configureFastifyApp(app);
    await app.init();
  }, 30_000);

  it('serves the public health contract with request ID', async () => {
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: 'GET',
        url: '/api/health',
        headers: { 'x-request-id': 'full-app-smoke-id' },
      });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBe('full-app-smoke-id');
    expect(response.json()).toMatchObject({
      success: true,
      data: { status: 'ok', service: 'api' },
    });
  });

  it('logs in and clears auth cookies through Fastify', async () => {
    const login = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'agent@jobmatch.com', password: 'Agent@123456' },
      });

    expect(login.statusCode).toBe(200);
    const setCookie = login.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookieHeader = (Array.isArray(setCookie) ? setCookie : [setCookie])
      .map((cookie) => cookie?.split(';', 1)[0])
      .filter(Boolean)
      .join('; ');

    const logout = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: 'POST',
        url: '/api/auth/logout',
        headers: { cookie: cookieHeader },
      });

    expect(logout.statusCode).toBe(200);
    expect(logout.headers['set-cookie']).toBeDefined();
  });

  afterAll(async () => {
    const storage = app?.get<{ onModuleDestroy?: () => void }>(
      ThrottlerStorage,
      { strict: false },
    );
    storage?.onModuleDestroy?.();
    await app?.close();
  });
});
