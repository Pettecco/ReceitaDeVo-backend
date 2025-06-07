import { forwardRef, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisSyncService } from './redis-sync.service';
import Redis from 'ioredis';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [forwardRef(() => RecipesModule)],
  providers: [
    {
      provide: 'Redis',
      useFactory: () => new Redis(process.env.REDIS_URL),
    },
    RedisService,
    RedisSyncService,
  ],
  exports: ['Redis', RedisService],
})
export class RedisModule {}
