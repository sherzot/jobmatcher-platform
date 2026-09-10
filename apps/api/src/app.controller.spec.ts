import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let queryRaw: jest.Mock;

  beforeEach(async () => {
    queryRaw = jest.fn().mockResolvedValue([{ 1: 1 }]);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: { $queryRaw: queryRaw } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('checks database connectivity and returns service status', async () => {
      await expect(appController.health()).resolves.toEqual({
        status: 'ok',
        service: 'api',
      });
      expect(queryRaw).toHaveBeenCalledTimes(1);
    });

    it('skips throttling for monitoring probes', () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        AppController.prototype,
        'health',
      );
      const health = descriptor?.value as object;
      expect(Reflect.getMetadata('THROTTLER:SKIPdefault', health)).toBe(true);
    });
  });
});
