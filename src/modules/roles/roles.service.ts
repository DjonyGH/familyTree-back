import { HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_ROLE_ALREADY_EXIST,
  ERROR_OF_ROLE_CREATE,
  ERROR_OF_ROLE_DELETION,
  ERROR_OF_ROLE_UPDATE,
  ROLE_NOT_FOUND,
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
    return this.roleModel.find({ ownerId });
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
    try {
      const deletedRole = await this.roleModel.findByIdAndRemove(id);
      if (deletedRole) return deletedRole;
      throw 'notFound';
    } catch (e: any) {
      handleManyErrors(e, ERROR_OF_ROLE_DELETION);
    }
  }
}
