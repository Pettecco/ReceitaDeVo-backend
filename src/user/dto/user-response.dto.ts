import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'vovó_conceição',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiPropertyOptional({
    example: 'image/png',
    description: 'MIME type of avatar image',
  })
  avatarMimeType?: string;

  @ApiPropertyOptional({
    example: 'iVBORw0KGgoAAAANSUhEUg...',
    description: 'Avatar image in base64 encoding',
  })
  avatarBase64?: string;
}
