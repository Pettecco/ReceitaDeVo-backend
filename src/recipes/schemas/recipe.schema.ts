import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop({ type: String, default: '' })
  steps: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  authorId: mongoose.Types.ObjectId;

  @Prop()
  imageBase64?: string;

  @Prop()
  imageMimeType?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
export type RecipeDocument = Recipe & Document;
