import { HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_ROLE_DELETION,
  ERROR_OF_ROLE_UPDATE,
  ROLE_NOT_FOUND,
} from 'src/errors/error.consts';
import { handleError } from 'src/utils/handleError';
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
    const role = await this.roleModel.findById(id);
    if (role) return role;
    handleError(ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async createRole(
    dto: CreateOrUpdateRoleDto,
    ownerId: string,
  ): Promise<DocumentType<RoleModel>> {
    const role = { ...dto, isOwner: false, ownerId };
    return this.roleModel.create(role);
  }

  async updateRole(
    id: string,
    dto: CreateOrUpdateRoleDto,
  ): Promise<DocumentType<RoleModel>> {
    const role = { ...dto, isOwner: false };
    const updatedRole = await this.roleModel.findByIdAndUpdate(id, role, {
      new: true,
    });

    if (updatedRole) return updatedRole;

    handleError(ERROR_OF_ROLE_UPDATE, HttpStatus.NOT_FOUND);
  }

  async deleteRole(id: string) {
    const deletedRole = await this.roleModel.findByIdAndRemove(id);
    if (deletedRole) return deletedRole;
    handleError(ERROR_OF_ROLE_DELETION, HttpStatus.NOT_FOUND);
  }
}
