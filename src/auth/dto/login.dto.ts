import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'vovo_maria' })
  username: string;

  @ApiProperty({ example: 'senhaSegura123' })
  password: string;
}
