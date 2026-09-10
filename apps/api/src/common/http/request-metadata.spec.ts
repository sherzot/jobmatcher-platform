import { requestPath, resolveRequestId } from './request-metadata';

describe('request metadata', () => {
  it('accepts safe bounded request ids', () => {
    expect(resolveRequestId('trace-123')).toBe('trace-123');
  });

  it('generates a new id for unsafe input', () => {
    const id = resolveRequestId('bad id\n');
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('normalizes request path without query string', () => {
    expect(requestPath({ url: '/api/jobs?page=2' })).toBe('/api/jobs');
    expect(requestPath({ path: '/api/health', url: '/ignored' })).toBe(
      '/api/health',
    );
  });
});
