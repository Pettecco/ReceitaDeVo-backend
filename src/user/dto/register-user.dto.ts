import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'vovó_conceicao',
    description: 'Unique username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'senhaSuperSecreta123',
    description: 'User password (min. 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
