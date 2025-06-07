import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from 'src/recipes/schemas/recipe.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RedisSyncService {
  private readonly logger = new Logger(RedisSyncService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncRedisToMongo() {
    this.logger.log('Synchronizing data from Redis to MongoDB...');
    const recipes = await this.recipeModel.find({}, '_id').lean();

    for (const recipe of recipes) {
      const views = await this.redisService.getRecipeViews(
        recipe._id.toString(),
      );

      const likes = await this.redisService.getLikesCount(
        recipe._id.toString(),
      );

      await this.recipeModel.updateOne(
        { _id: recipe._id },
        { $set: { views, likes } },
      );
    }
    this.logger.log('Synchronization completed');
  }
}
