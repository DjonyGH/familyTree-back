import { HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { genSaltSync, hashSync } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import {
  ERROR_OF_OWNER_DELETION,
  ERROR_OF_OWNER_ROLE_UPDATE,
  ERROR_OF_OWNER_UPDATE,
  ERROR_OF_USER_ALREADY_EXIST,
  ERROR_OF_USER_AS_OWNER_CREATE,
  ERROR_OF_USER_CREATE,
  ERROR_OF_USER_DELETION,
  ERROR_OF_USER_UPDATE,
  FORBIDDEN,
  UNKNOWN_ERROR,
  USER_NOT_FOUND,
} from '../../errors/error.consts';
import { UserModel } from './user.model';
import { IUserResponse, TPermission } from './types';
import { RoleService } from '../roles/roles.service';
import { handleError, handleManyErrors } from 'src/utils/handleError';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
    private readonly roleService: RoleService,
  ) {}

  async getAllUsers(ownerId: string): Promise<IUserResponse[]> {
    try {
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
    } catch {
      handleError(UNKNOWN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string): Promise<IUserResponse | null> {
    try {
      const user = await this.userModel.findById(id);
      if (user) {
        const role = (await this.roleService.getRoleById(user.roleId)) || null;
        user.password = undefined;
        user.ownerId = undefined;
        user.roleId = undefined;
        return {
          ...user.toObject(),
          role,
        };
      }
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, USER_NOT_FOUND);
    }
  }

  async createUser(
    dto: CreateUserDto,
    ownerId: string,
  ): Promise<IUserResponse | null> {
    const role = (await this.roleService.getRoleById(dto.roleId)) || null;
    // Нельзя создать пользователя с ролью "Владелец аккаунта"
    if (role.isOwner)
      handleError(ERROR_OF_USER_AS_OWNER_CREATE, HttpStatus.BAD_REQUEST);

    const salt = genSaltSync(10);
    const password = hashSync(dto.password, salt);
    const user = { ...dto, password, ownerId };
    try {
      const createdUser = await this.userModel.create(user);
      if (createdUser) {
        createdUser.password = undefined;
        createdUser.ownerId = undefined;
        createdUser.roleId = undefined;
        return {
          ...createdUser.toObject(),
          role: role || null,
        };
      }
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, ERROR_OF_USER_CREATE, ERROR_OF_USER_ALREADY_EXIST);
    }
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    isOwner: boolean,
  ): Promise<IUserResponse | null> {
    const updatingUser = await this.findUserById(id);
    // Нельзя изменять пользователя "Владелец аккаунта", елси ты не "Владелец аккаунта"
    if (!isOwner && updatingUser.id === updatingUser.ownerId) {
      handleError(ERROR_OF_OWNER_UPDATE, HttpStatus.BAD_REQUEST);
    }
    // Нельзя изменять роль у пользователя "Владелец аккаунта"
    if (
      updatingUser.id === updatingUser.ownerId &&
      dto.roleId !== updatingUser.roleId
    ) {
      handleError(ERROR_OF_OWNER_ROLE_UPDATE, HttpStatus.BAD_REQUEST);
    }

    const user = { ...dto, password: undefined, login: undefined };
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      if (updatedUser) {
        const role = (await this.roleService.getRoleById(user.roleId)) || null;
        updatedUser.password = undefined;
        updatedUser.ownerId = undefined;
        updatedUser.roleId = undefined;
        return {
          ...updatedUser.toObject(),
          role,
        };
      }
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, ERROR_OF_USER_UPDATE, ERROR_OF_USER_ALREADY_EXIST);
    }
  }

  async deleteUser(id: string) {
    const deletingUser = await this.findUserById(id);
    // Нельзя удалить пользователя "Владелец аккаунта"
    if (deletingUser.id === deletingUser.ownerId) {
      handleError(ERROR_OF_OWNER_DELETION, HttpStatus.BAD_REQUEST);
    } else {
      try {
        const deletedUser = await this.userModel.findByIdAndRemove(id);
        if (deletedUser) return deletedUser;
        throw 'notFound';
      } catch (e: any) {
        handleManyErrors(e, ERROR_OF_USER_DELETION);
      }
    }
  }

  async findUserByLogin(
    login: string,
  ): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async findUserById(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findById(id);
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
}
