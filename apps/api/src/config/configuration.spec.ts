import { configValidationSchema } from './configuration';

describe('runtime configuration validation', () => {
  const base = {
    DATABASE_URL: 'mysql://user:pass@localhost:3306/db',
    JWT_ACCESS_SECRET: 'a'.repeat(32),
    JWT_REFRESH_SECRET: 'b'.repeat(32),
  };

  it('accepts configured log levels and Redis password', () => {
    const result = configValidationSchema.validate({
      ...base,
      LOG_LEVELS: 'error,warn,log',
      REDIS_PASSWORD: 'redis-secret',
    });
    expect(result.error).toBeUndefined();
  });

  it('rejects unknown log levels', () => {
    const result = configValidationSchema.validate({
      ...base,
      LOG_LEVELS: 'error,trace',
    });
    expect(result.error).toBeDefined();
  });
});
