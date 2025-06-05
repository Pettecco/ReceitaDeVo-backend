import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Readable } from 'stream';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';

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
  @Get(':username/avatar')
  async getAvatar(
    @Param('username') username: string,
  ): Promise<StreamableFile> {
    const user = await this.usersService.findByUsername(username);

    if (!user?.avatarBase64 || !user?.avatarMimeType) {
      throw new NotFoundException('No avatar found');
    }

    const buffer = Buffer.from(user.avatarBase64, 'base64');
    const stream = Readable.from(buffer);

    return new StreamableFile(stream, {
      type: user.avatarMimeType,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.usersService.updateAvatar(userId, file.buffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
