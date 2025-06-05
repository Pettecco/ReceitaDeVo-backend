import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { Model } from 'mongoose';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = new this.recipeModel(createRecipeDto);
    return recipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId.toString() !== updateRecipeDto.authorId) {
      throw new ForbiddenException('You can only edit your own recipes');
    }

    const updated = await this.recipeModel
      .findByIdAndUpdate(id, updateRecipeDto, { new: true })
      .exec();
    return updated;
  }

  async remove(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.recipeModel.findByIdAndDelete(id).exec();
  }
}
