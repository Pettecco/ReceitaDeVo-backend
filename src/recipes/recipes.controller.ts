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

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

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
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req,
  ) {
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
}
