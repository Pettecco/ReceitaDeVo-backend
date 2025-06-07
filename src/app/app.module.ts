import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from 'src/recipes/recipes.module';
import { RedisModule } from 'src/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisSyncService } from 'src/redis/redis-sync.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    RecipesModule,
    RedisModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, RedisSyncService],
})
export class AppModule {}
