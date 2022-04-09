import { HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_IS_OWNER_ROLE_DELETION,
  ERROR_OF_IS_OWNER_ROLE_UPDATE,
  ERROR_OF_ROLE_ALREADY_EXIST,
  ERROR_OF_ROLE_CREATE,
  ERROR_OF_ROLE_DELETION,
  ERROR_OF_ROLE_UPDATE,
  ROLE_NOT_FOUND,
  UNKNOWN_ERROR,
} from 'src/errors/error.consts';
import { handleError, handleManyErrors } from 'src/utils/handleError';
import { CreateOrUpdateRoleDto } from './dto/createOrUpdate.role.dto';
import { RoleModel } from './roles.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: ModelType<RoleModel>,
  ) {}

  async getAllRoles(ownerId: string): Promise<DocumentType<RoleModel>[]> {
    try {
      return this.roleModel.find({ ownerId });
    } catch {
      handleError(UNKNOWN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoleById(id: string): Promise<DocumentType<RoleModel> | null> {
    try {
      const role = await this.roleModel.findById(id);
      if (role) return role;
      throw 'notFound';
    } catch (e) {
      handleManyErrors(e, ROLE_NOT_FOUND);
    }
  }

  async createRole(
    dto: CreateOrUpdateRoleDto,
    ownerId: string,
  ): Promise<DocumentType<RoleModel>> {
    const role = { ...dto, isOwner: false, ownerId };
    try {
      const createdRole = await this.roleModel.create(role);
      if (createdRole) return createdRole;
      throw 'notFound';
    } catch (e) {
      handleManyErrors(e, ERROR_OF_ROLE_CREATE, ERROR_OF_ROLE_ALREADY_EXIST);
    }
  }

  async updateRole(
    id: string,
    dto: CreateOrUpdateRoleDto,
  ): Promise<DocumentType<RoleModel>> {
    const updatingRole = await this.getRoleById(id);
    // !!! Здесь должно быть: изменять роль "Владелец аккаунта" может только он сам, при этом только name и description
    if (updatingRole.isOwner)
      handleError(ERROR_OF_IS_OWNER_ROLE_UPDATE, HttpStatus.BAD_REQUEST);

    const role = { ...dto, isOwner: false };
    try {
      const updatedRole = await this.roleModel.findByIdAndUpdate(id, role, {
        new: true,
      });
      if (updatedRole) return updatedRole;
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, ERROR_OF_ROLE_UPDATE, ERROR_OF_ROLE_ALREADY_EXIST);
    }
  }

  async deleteRole(id: string) {
    const deletingRole = await this.getRoleById(id);
    // Нельзя удалить роль "Владелец аккаунта"
    if (deletingRole.isOwner)
      handleError(ERROR_OF_IS_OWNER_ROLE_DELETION, HttpStatus.BAD_REQUEST);
    try {
      const deletedRole = await this.roleModel.findByIdAndRemove(id);
      if (deletedRole) return deletedRole;
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, ERROR_OF_ROLE_DELETION);
    }
  }
}
