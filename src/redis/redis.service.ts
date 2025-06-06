import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('Redis') private readonly redis: Redis) {}

  async addView(recipeId: string): Promise<number> {
    const key = `recipe:${recipeId}:views`;
    return await this.redis.incr(key);
  }

  async getRecipeViews(recipeId: string): Promise<number> {
    const key = `recipe:${recipeId}:views`;
    const value = await this.redis.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  async likeRecipe(recipeId: string, userId: string): Promise<number> {
    const key = `recipe:${recipeId}:likes`;
    await this.redis.sadd(key, userId);
    return this.redis.scard(key);
  }

  async unlikeRecipe(recipeId: string, userId: string): Promise<number> {
    const key = `recipe:${recipeId}:likes`;
    await this.redis.srem(key, userId);
    return this.redis.scard(key);
  }

  async getLikesCount(recipeId: string): Promise<number> {
    const key = `recipe:${recipeId}:likes`;
    return this.redis.scard(key);
  }

  async hasUserLiked(recipeId: string, userId: string): Promise<boolean> {
    const key = `recipe:${recipeId}:likes`;
    return this.redis.sismember(key, userId).then((res) => res === 1);
  }
}
