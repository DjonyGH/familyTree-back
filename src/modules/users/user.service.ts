import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { genSaltSync, hashSync } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { USER_NOT_FOUND } from '../../errors/error.consts';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    return this.userModel.create(dto);
  }

  async findUser(login: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async setPassword({ userId, password }) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const salt = genSaltSync(10);
    user.password = hashSync(password, salt);
    user.save();
  }

  async updateUser(dto: UpdateUserDto) {
    return this.userModel.updateOne({ login: dto.login }, dto);
  }
}
