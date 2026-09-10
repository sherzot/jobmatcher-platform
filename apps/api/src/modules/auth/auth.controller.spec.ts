import { Reflector } from '@nestjs/core';
import { AuthController } from './auth.controller';

describe('AuthController security metadata', () => {
  it('applies a stricter login throttle policy', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      AuthController.prototype,
      'login',
    );
    const login = descriptor?.value as object;
    const reflector = new Reflector();

    expect(reflector.get<number>('THROTTLER:LIMITdefault', login)).toBe(5);
    expect(reflector.get<number>('THROTTLER:TTLdefault', login)).toBe(60_000);
  });
});
