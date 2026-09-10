export type AuthCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge?: number;
};

export type AuthCookieResponse = {
  cookie?: (name: string, value: string, options: AuthCookieOptions) => unknown;
  setCookie?: (
    name: string,
    value: string,
    options: AuthCookieOptions,
  ) => unknown;
  clearCookie: (name: string, options: { path: string }) => unknown;
};

export function writeAuthCookie(
  response: AuthCookieResponse,
  name: string,
  value: string,
  options: AuthCookieOptions,
): void {
  if (response.cookie) {
    response.cookie(name, value, options);
    return;
  }
  response.setCookie?.(name, value, options);
}

export function clearAuthCookie(
  response: AuthCookieResponse,
  name: string,
  options: { path: string },
): void {
  response.clearCookie(name, options);
}
