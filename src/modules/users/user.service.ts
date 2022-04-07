import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { genSaltSync, hashSync } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { USER_NOT_FOUND } from '../../errors/error.consts';
import { UserModel } from './user.model';
import { IUserResponse, TPermission } from './types';
import { RoleService } from '../roles/roles.service';
import { getObjectIdFromString } from 'src/utils/getObjectIdFromString';
import { checkId } from 'src/utils/checkId';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
    private readonly roleService: RoleService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    return this.userModel.create(dto);
  }

  async findUser(login: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async getUserById(id: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findById(id);
    if (user) {
      const role = await this.roleService.getRoleById(user.roleId);
      user.password = undefined;
      user.ownerId = undefined;
      user.roleId = undefined;
      return {
        ...user.toObject(),
        role,
      };
    }
    throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async checkPermissionByUser(
    userId: string,
    permission: TPermission,
  ): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user?.role?.[permission];
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
