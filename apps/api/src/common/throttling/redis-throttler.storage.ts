import Redis from 'ioredis';
import type { ThrottlerStorage } from '@nestjs/throttler';
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';

type LocalBucket = { hits: number; expiresAt: number; blockedUntil: number };

export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: Redis;
  private readonly local = new Map<string, LocalBucket>();

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const redisKey = `throttle:${throttlerName}:${key}`;
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      const hits = await this.redis.incr(redisKey);
      if (hits === 1) await this.redis.pexpire(redisKey, ttl);
      const blocked = hits > limit;
      if (blocked && blockDuration > 0) {
        await this.redis.pexpire(redisKey, blockDuration);
      }
      const timeToExpire = await this.redis.pttl(redisKey);
      return {
        totalHits: hits,
        timeToExpire: Math.max(timeToExpire, 0),
        isBlocked: blocked,
        timeToBlockExpire: blocked ? Math.max(timeToExpire, 0) : 0,
      };
    } catch {
      return this.incrementLocal(redisKey, ttl, limit, blockDuration);
    }
  }

  private incrementLocal(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
  ): ThrottlerStorageRecord {
    const now = Date.now();
    const current = this.local.get(key);
    const bucket =
      !current || current.expiresAt <= now
        ? { hits: 0, expiresAt: now + ttl, blockedUntil: 0 }
        : current;
    bucket.hits += 1;
    if (bucket.hits > limit && blockDuration > 0) {
      bucket.blockedUntil = now + blockDuration;
      bucket.expiresAt = bucket.blockedUntil;
    }
    this.local.set(key, bucket);
    const remaining = Math.max(bucket.expiresAt - now, 0);
    return {
      totalHits: bucket.hits,
      timeToExpire: remaining,
      isBlocked: bucket.hits > limit,
      timeToBlockExpire:
        bucket.blockedUntil > now ? bucket.blockedUntil - now : 0,
    };
  }
}
