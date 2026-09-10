/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import Redis from 'ioredis';
import { RedisThrottlerStorage } from './redis-throttler.storage';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    status: 'ready',
    connect: jest.fn(),
    incr: jest.fn().mockResolvedValue(2),
    pexpire: jest.fn().mockResolvedValue(1),
    pttl: jest.fn().mockResolvedValue(45_000),
  }));
});

describe('RedisThrottlerStorage', () => {
  it('increments Redis counters and returns expiry metadata', async () => {
    const storage = new RedisThrottlerStorage();
    const result = await storage.increment(
      '127.0.0.1',
      60_000,
      5,
      0,
      'default',
    );

    expect(result).toEqual({
      totalHits: 2,
      timeToExpire: 45_000,
      isBlocked: false,
      timeToBlockExpire: 0,
    });
    const client = (Redis as unknown as jest.Mock).mock.results[0].value;
    expect(client.incr).toHaveBeenCalledWith('throttle:default:127.0.0.1');
    expect(client.pexpire).not.toHaveBeenCalled();
  });

  it('marks a request blocked when the limit is exceeded', async () => {
    const storage = new RedisThrottlerStorage();
    const client = (Redis as unknown as jest.Mock).mock.results[1].value;
    client.incr.mockResolvedValue(6);

    const result = await storage.increment(
      'user-1',
      60_000,
      5,
      30_000,
      'login',
    );

    expect(result.isBlocked).toBe(true);
    expect(client.pexpire).toHaveBeenCalledWith(
      'throttle:login:user-1',
      30_000,
    );
  });
});
