import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { PermissionModel } from './permission.model';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionModel)
    private readonly permissionModel: ModelType<PermissionModel>,
  ) {}

  async getPermissionById() {}

  async createPermission() {}

  async updatePermission() {}

  async deletePermission() {}
}
