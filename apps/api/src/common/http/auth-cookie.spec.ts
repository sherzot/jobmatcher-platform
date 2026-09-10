import {
  clearAuthCookie,
  writeAuthCookie,
  type AuthCookieOptions,
} from './auth-cookie';

const options: AuthCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
};

describe('auth cookie port', () => {
  it('writes Express-style cookies', () => {
    const response = { cookie: jest.fn(), clearCookie: jest.fn() };
    writeAuthCookie(response, 'access_token', 'token', options);
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'token',
      options,
    );
  });

  it('writes Fastify-style cookies', () => {
    const response = { setCookie: jest.fn(), clearCookie: jest.fn() };
    writeAuthCookie(response, 'access_token', 'token', options);
    expect(response.setCookie).toHaveBeenCalledWith(
      'access_token',
      'token',
      options,
    );
  });

  it('clears cookies through the adapter response', () => {
    const response = { clearCookie: jest.fn() };
    clearAuthCookie(response, 'access_token', { path: '/' });
    expect(response.clearCookie).toHaveBeenCalledWith('access_token', {
      path: '/',
    });
  });
});
