import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'vovó_conceicão',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiProperty({ example: 'senhaSuperSecreta', description: 'User password' })
  password: string;
}
