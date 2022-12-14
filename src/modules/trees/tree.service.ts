import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { lookup } from 'dns';
import { InjectModel } from 'nestjs-typegoose';
import {
  ERROR_OF_PERMISSION_CREATE,
  ERROR_OF_PERMISSION_UPDATE,
  ERROR_OF_TREE_CREATE,
  ERROR_OF_TREE_UPDATE,
  PERMISSION_NOT_FOUND,
} from 'src/errors/error.consts';
import { TObjectId } from 'src/types';
import { CreatePermissionDto } from '../permissions/dto/create.permission.dto';
import { PermissionModel } from '../permissions/permission.model';
import { PermissionService } from '../permissions/permission.service';
import { EType } from '../permissions/types';
import { CreateTreeDto } from './dto/create.tree.dto copy';
import { UpdateTreeDto } from './dto/update.tree.dto';

import { TreeModel } from './tree.model';
import { ITreeResponse } from './types';

@Injectable()
export class TreeService {
  constructor(
    @InjectModel(TreeModel)
    private readonly treeModel: ModelType<TreeModel>,
    private readonly permissionService: PermissionService,
  ) {}

  async getAllTreesByUserId(userId: TObjectId): Promise<any[]> {
    try {
      const permissions =
        await this.permissionService.getAllPermissionsWithTreeByUserId(userId);

      const trees = permissions.reduce((acc, item) => {
        if (item.treeObj[0]) {
          const tree = {
            id: item.treeId,
            name: item.treeObj[0].name,
            permissionType: item.type,
            createdBy: item.treeObj[0].createdBy,
            updatedBy: item.treeObj[0].updatedBy,
            createdAt: item.treeObj[0].createdAt,
            updatedAt: item.treeObj[0].updatedAt,
          };
          acc.push(tree);
        }
        return acc;
      }, []);

      return trees;
    } catch (e: any) {
      throw new HttpException(PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createTree(
    dto: CreateTreeDto,
    createdBy: TObjectId,
  ): Promise<ITreeResponse> {
    try {
      const tree = { ...dto, createdBy };
      const createdTree = await this.treeModel.create(tree);
      if (!createdTree) throw 'errorOfTreeCreate';

      const permission: CreatePermissionDto = {
        userId: createdBy,
        treeId: createdTree.id,
        type: EType.admin,
      };
      const createdPermission = await this.permissionService.createPermission(
        permission,
        createdBy,
      );
      if (!createdPermission) throw 'errorOfPermissionCreate';
      return {
        ...createdTree.toObject(),
        typePermission: createdPermission.type,
      };
    } catch (e) {
      throw new HttpException(ERROR_OF_TREE_CREATE, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTree(dto: UpdateTreeDto, updatedBy: TObjectId, id: TObjectId) {
    try {
      const tree = { ...dto, updatedBy };
      const updatedTree = await this.treeModel.findByIdAndUpdate(id, tree, {
        new: true,
      });
      if (!updatedTree) throw 'errorOfTreeUpdate';
      return updatedTree;
    } catch (error) {
      throw new HttpException(ERROR_OF_TREE_UPDATE, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteTree() {}
}
