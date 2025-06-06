import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Tacos Mexicanos', description: 'Recipe title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Clássicos tacos mexicanos com carne temperada e guacamole.',
    description: 'Brief description of the recipe',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: [
      '500g de carne moída',
      '1 cebola picada',
      '2 dentes de alho amassados',
      '1 colher (sopa) de cominho em pó',
      '1 colher (chá) de páprica',
      '8 tortillas de milho',
      '1 xícara de alface picada',
      '1 tomate picado',
      '1/2 xícara de coentro fresco picado',
      '1 abacate maduro',
      'Suco de 1 limão',
      'Sal a gosto',
      'Pimenta a gosto',
    ],
    description: 'List of ingredients',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    example:
      '1. Tempere a carne moída com sal, pimenta, cominho e páprica.' +
      ' 2. Refogue a cebola e o alho até ficarem dourados. Adicione a carne e cozinhe até estar bem dourada.' +
      ' 3. Aqueça as tortillas em uma frigideira até ficarem macias.' +
      ' 4. Amasse o abacate, misture com suco de limão, sal e pimenta para fazer o guacamole.' +
      ' 5. Monte os tacos: coloque a carne em cada tortilla, adicione alface, tomate, coentro e uma colher de guacamole por cima.' +
      ' 6. Sirva imediatamente, acompanhando com limões cortados.',
    description: 'Step-by-step preparation instructions (free text)',
  })
  @IsString()
  @IsNotEmpty()
  steps: string;

  @IsString()
  @IsOptional()
  imageBase64?: string;

  @IsString()
  @IsOptional()
  imageMimeType?: string;

  @ApiProperty({
    example: '64b7f2c2e4b0a5d1c8e4a123',
    description: 'ID of the user who is the author of the recipe',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
