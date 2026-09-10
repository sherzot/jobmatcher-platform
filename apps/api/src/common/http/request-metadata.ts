import { randomUUID } from 'node:crypto';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

export function resolveRequestId(incoming: unknown): string {
  const value = typeof incoming === 'string' ? incoming : '';
  return REQUEST_ID_PATTERN.test(value) ? value : randomUUID();
}

export function requestPath(request: { path?: string; url?: string }): string {
  return request.path ?? request.url?.split('?')[0] ?? '/';
}
