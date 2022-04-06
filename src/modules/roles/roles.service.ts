import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateOrUpdateRoleDto } from './dto/createOrUpdate.role.dto';
import { RoleModel } from './roles.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: ModelType<RoleModel>,
  ) {}

  async createRole(
    dto: CreateOrUpdateRoleDto,
    ownerId: string,
  ): Promise<DocumentType<RoleModel>> {
    const role = { ...dto, isOwner: false, ownerId };
    return this.roleModel.create(role);
  }

  async getRoleById(id: string): Promise<DocumentType<RoleModel> | null> {
    return this.roleModel.findById(id);
  }

  async updateRole(dto: CreateOrUpdateRoleDto) {
    return this.roleModel.updateOne({ name: dto.name }, dto);
  }
}
