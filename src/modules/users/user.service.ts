import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
  ) {}

  async getAllUsers() {}

  async getUserById() {}

  async createUser() {}

  async updateUser() {}

  async deleteUser() {}

  async findUserByLogin(
    login: string,
  ): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async findUserById() {}

  async checkPermissionByUser() {}

  async execAfterUserCheckPermission() {}

  async setPassword() {}
}
