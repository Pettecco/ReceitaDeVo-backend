import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    example: 'vovo_conceicao',
    description: 'Unique username of the user',
  })
  @IsString()
  username: string;

  @ApiPropertyOptional({
    example: 'image/png',
    description: 'MIME type of avatar image',
  })
  @IsOptional()
  @IsString()
  avatarMimeType?: string;

  @ApiPropertyOptional({
    example: 'iVBORw0KGgoAAAANSUhEUg...',
    description: 'Avatar image in base64 encoding',
  })
  @IsOptional()
  @IsString()
  avatarBase64?: string;
}
