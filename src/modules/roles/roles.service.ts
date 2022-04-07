import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_ROLE_DELETION,
  ROLE_NOT_FOUND,
} from 'src/errors/error.consts';
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
    throw new HttpException(ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async createRole(
    dto: CreateOrUpdateRoleDto,
    ownerId: string,
  ): Promise<DocumentType<RoleModel>> {
    const role = { ...dto, isOwner: false, ownerId };
    return this.roleModel.create(role);
  }

  // async updateRole(dto: CreateOrUpdateRoleDto) {
  //   return this.roleModel.updateOne({ name: dto.name }, dto);
  // }

  async deleteRole(id: string) {
    const deletedRole = await this.roleModel.findByIdAndRemove(id);
    if (deletedRole) return deletedRole;
    throw new HttpException(ERROR_OF_ROLE_DELETION, HttpStatus.NOT_FOUND);
  }
}
