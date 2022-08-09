import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND } from 'src/errors/error.consts';
import { IUserResponse } from './types';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
  ) {}

  async getUserById(id: string): Promise<IUserResponse | null> {
    console.log('service: get user by id');
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        user.password = undefined;
        return user;
      }
    } catch (e: any) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createUser() {}

  async updateUser() {}

  async deleteUser() {}

  async findUserByLogin(
    login: string,
  ): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async setPassword() {}
}
