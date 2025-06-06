import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'Redis',
      useFactory: () => new Redis(process.env.REDIS_URL),
    },
    RedisService,
  ],
  exports: ['Redis', RedisService],
})
export class RedisModule {}
