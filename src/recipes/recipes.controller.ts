import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/schemas/user.schema';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
    return this.recipesService.create({
      ...createRecipeDto,
      authorId: req.user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ status: 200, description: 'List of all recipes.' })
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one recipe by id' })
  @ApiResponse({ status: 200, description: 'Recipe found.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update recipe by id' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not owner.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe by id' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not owner.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a recipe' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  addComment(
    @Param('id') recipeId: string,
    @Body('text') text: string,
    @Request() req,
  ) {
    return this.recipesService.addComment(recipeId, req.user.userId, text);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  @ApiOperation({ summary: 'Like a recipe' })
  @ApiResponse({ status: 201, description: 'Recipe liked successfully.' })
  async like(@Param('id') recipeId: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.redisService.likeRecipe(recipeId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/like')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove like from a recipe' })
  @ApiResponse({ status: 204, description: 'Like removed successfully.' })
  async unlike(@Param('id') recipeId: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.redisService.unlikeRecipe(recipeId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/like/status')
  @ApiOperation({ summary: 'Check if user has liked this recipe' })
  @ApiResponse({
    status: 200,
    description: 'Whether the user liked the recipe.',
  })
  async hasLiked(@Param('id') recipeId: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.redisService.hasUserLiked(recipeId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/like/count')
  @ApiOperation({ summary: 'Get total likes of a recipe' })
  @ApiResponse({
    status: 200,
    description: 'Total number of likes for the recipe.',
  })
  async getLikesCount(@Param('id') recipeId: string) {
    return this.redisService.getLikesCount(recipeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/view')
  @ApiOperation({ summary: 'Increment recipe view count' })
  @ApiResponse({ status: 200, description: 'View count incremented.' })
  async addView(@Param('id') recipeId: string) {
    const recipe = await this.recipesService.findOne(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    const views = await this.redisService.addView(recipeId);
    return { views };
  }

  @Get(':id/views')
  @ApiOperation({ summary: 'Get total views of a recipe' })
  @ApiResponse({
    status: 200,
    description: 'Total number of views for the recipe.',
  })
  async getViews(@Param('id') recipeId: string) {
    const recipe = await this.recipesService.findOne(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    const views = await this.redisService.getRecipeViews(recipeId);
    return { views };
  }
}
