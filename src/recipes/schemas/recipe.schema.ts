import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RecipeComment, CommentSchema } from './comments.schema';

@Schema({ timestamps: true })
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

  @Prop({ type: [CommentSchema], default: [] })
  comments: RecipeComment[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  views: number;

  @Prop()
  imageBase64?: string;

  @Prop()
  imageMimeType?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
export type RecipeDocument = Recipe & Document;
