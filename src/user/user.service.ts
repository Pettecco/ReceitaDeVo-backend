import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as fileType from 'file-type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  async create(username: string, password: string): Promise<UserDocument> {
    const hashed = await bcrypt.hash(password, 10);

    const user = new this.userModel({ username, password: hashed });
    return user.save();
  }

  async deleteUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(userId);
  }

  async updateAvatar(
    userId: string,
    buffer: Buffer,
  ): Promise<Omit<User, 'password'>> {
    const type = await fileType.fromBuffer(buffer);

    if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
      throw new BadRequestException('Only JPEG or PNG images are allowed');
    }

    const base64Image = buffer.toString('base64');
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          avatarBase64: base64Image,
          avatarMimeType: type.mime,
        },
        { new: true },
      )
      .lean();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }
}
