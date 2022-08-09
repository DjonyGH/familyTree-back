import { DocumentType } from '@typegoose/typegoose/lib/types';
import { TreeModel } from '../trees/tree.model';
import { PermissionModel } from './permission.model';

export enum EType {
  admin = 'admin',
  editor = 'editor',
  viewer = 'viewer',
}

export interface IAllPermissionsWithTreeResponse
  extends DocumentType<PermissionModel> {
  treeObj: DocumentType<TreeModel>;
}
