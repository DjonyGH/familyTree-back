import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { genSaltSync, hashSync } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import {
  ERROR_OF_USER_CREATE,
  FORBIDDEN,
  USER_NOT_FOUND,
} from '../../errors/error.consts';
import { UserModel } from './user.model';
import { IUserResponse, TPermission } from './types';
import { RoleService } from '../roles/roles.service';
import { handleError } from 'src/utils/handleError';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
    private readonly roleService: RoleService,
  ) {}

  async getAllUsers(ownerId: string): Promise<IUserResponse[]> {
    const users = await this.userModel.find({ ownerId });
    const roles = await this.roleService.getAllRoles(ownerId);
    const userResponse: IUserResponse[] = users.map((user) => {
      const role = roles.find((role) => role.id === user.roleId) || null;
      user.password = undefined;
      user.ownerId = undefined;
      user.roleId = undefined;
      return {
        ...user.toObject(),
        role,
      };
    });
    return userResponse;
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

    handleError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async createUser(
    dto: CreateUserDto,
    ownerId: string,
  ): Promise<DocumentType<UserModel> | null> {
    const salt = genSaltSync(10);
    const password = hashSync(dto.password, salt);
    const user = { ...dto, password, ownerId };
    try {
      return await this.userModel.create(user);
    } catch {
      handleError(ERROR_OF_USER_CREATE, HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(login: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async checkPermissionByUser(
    userId: string,
    permission: TPermission,
  ): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user?.role?.[permission];
  }

  async execAfterUserCheckPermission(
    userId: string,
    permission: TPermission,
    action: () => any,
  ) {
    const user = await this.getUserById(userId);
    if (user?.role?.[permission]) {
      return action();
    }
    handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
  }

  async setPassword({ userId, password }) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      handleError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const salt = genSaltSync(10);
    user.password = hashSync(password, salt);
    user.save();
  }

  async updateUser(dto: UpdateUserDto) {
    return this.userModel.updateOne({ login: dto.login }, dto);
  }
}
