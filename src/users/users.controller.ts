import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const existingUser = await this.usersService.findByUsername(body.username);

    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const user = await this.usersService.create(body.username, body.password);
    const { password, ...result } = user.toObject();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async findUser(@Param('username') username: string) {
    const user: UserDocument | null =
      await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user.toObject();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
