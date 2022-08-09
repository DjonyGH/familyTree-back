import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { lookup } from 'dns';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_PERMISSION_CREATE,
  ERROR_OF_PERMISSION_UPDATE,
  PERMISSION_NOT_FOUND,
} from 'src/errors/error.consts';
import { CreatePermissionDto } from './dto/create.permission.dto';
import { UpdatePermissionDto } from './dto/update.permission.dto';
import { PermissionModel } from './permission.model';
import { IAllPermissionsWithTreeResponse } from './types';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionModel)
    private readonly permissionModel: ModelType<PermissionModel>,
  ) {}

  async getPermissionByUserId(userId: string): Promise<PermissionModel | null> {
    console.log('service: get permission by user id');
    try {
      const permission = await this.permissionModel.findOne({ userId });
      return permission;
    } catch (e: any) {
      throw new HttpException(PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async getAllPermissionsWithTreeByUserId(
    userId: string,
  ): Promise<IAllPermissionsWithTreeResponse[]> {
    console.log('service: get all permissions with tree by user id');
    try {
      // const permissions = await this.permissionModel.aggregate().f
      const permissions = await this.permissionModel
        .aggregate()
        .lookup({
          from: 'trees',
          localField: 'treeId',
          foreignField: '_id',
          as: 'treeObj',
        })
        .match({ userId: userId });

      return permissions;
    } catch (e: any) {
      throw new HttpException(PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createPermission(
    dto: CreatePermissionDto,
    createdBy: string,
  ): Promise<DocumentType<PermissionModel>> {
    try {
      // Здесь нужна проверка, что юзер может создавать пермишены только для тех деревьев, в которых он админ
      const permission = { ...dto, createdBy };
      const createPermission = await this.permissionModel.create(permission);
      if (createPermission) return createPermission;
    } catch (e) {
      throw new HttpException(
        ERROR_OF_PERMISSION_CREATE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePermission(
    dto: UpdatePermissionDto,
    updatedBy: string,
    id: string,
  ) {
    try {
      const permission = { ...dto, updatedBy };
      const updatedUser = await this.permissionModel.findByIdAndUpdate(
        id,
        permission,
        {
          new: true,
        },
      );
      if (!updatedUser) throw 'notFound';
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        ERROR_OF_PERMISSION_UPDATE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deletePermission() {}
}
