import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { lookup } from 'dns';
import { ObjectId, Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_PERMISSION_CREATE,
  ERROR_OF_PERMISSION_UPDATE,
  PERMISSION_NOT_FOUND,
} from 'src/errors/error.consts';
import { TObjectId } from 'src/types';
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

  async getAllPermissionsByUserId(
    userId: TObjectId,
  ): Promise<PermissionModel[] | null> {
    try {
      const permission = await this.permissionModel.find({
        userId,
      });
      return permission;
    } catch (e: any) {
      throw new HttpException(PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async getAllPermissionsWithTreeByUserId(
    userId: TObjectId,
  ): Promise<IAllPermissionsWithTreeResponse[]> {
    try {
      const permissions = await this.permissionModel
        .aggregate()
        .lookup({
          from: 'trees',
          localField: 'treeId',
          foreignField: '_id',
          as: 'treeObj',
        })
        .match({ userId });

      return permissions;
    } catch (e: any) {
      throw new HttpException(PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createPermission(
    dto: CreatePermissionDto,
    createdBy: TObjectId,
  ): Promise<DocumentType<PermissionModel>> {
    try {
      // Проверка, что пользователь, который создает право доступа является админом
      const permissions = await this.getAllPermissionsByUserId(createdBy);
      const permissionForCreatingTree = permissions?.find(
        (i) => i.treeId === dto.treeId,
      );
      if (permissionForCreatingTree?.type !== 'admin')
        throw 'errorOfPermissionCreate';

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
    updatedBy: TObjectId,
    id: TObjectId,
  ) {
    try {
      // Проверка, что пользователь, который изменяет право доступа является админом
      const permissions = await this.getAllPermissionsByUserId(updatedBy);
      const permissionForUpdatingTree = permissions?.find((i) => i._id === id);
      if (permissionForUpdatingTree?.type !== 'admin')
        throw 'errorOfPermissionUpdate';

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
