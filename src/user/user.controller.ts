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
import { UsersService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Readable } from 'stream';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  async register(@Body() body: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersService.findByUsername(body.username);

    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const user = await this.usersService.create(body.username, body.password);
    const { password, ...result } = user.toObject();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':username')
  @ApiOperation({ summary: 'Get user details by username' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findUser(
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user.toObject();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get user details by user ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user.toObject();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':username/avatar')
  @ApiOperation({ summary: 'Get user avatar as image stream' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({
    status: 200,
    description: 'User avatar served as an image stream',
  })
  @ApiResponse({ status: 404, description: 'No avatar found.' })
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
  @ApiBearerAuth()
  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Update user avatar (JPEG or PNG image)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'JPEG or PNG image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar updated successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'No file uploaded or invalid file type.',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Multer.File,
  ): Promise<UserResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.usersService.updateAvatar(userId, file.buffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.usersService.deleteUser(id);
    return { deleted: true };
  }
}
