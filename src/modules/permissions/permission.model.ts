import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectId, Types } from 'mongoose';
import { TObjectId } from 'src/types';
import { EType } from './types';

export interface PermissionModel extends Base {}

// @index({ login: 1 }, { unique: true })
export class PermissionModel extends TimeStamps {
  @prop({ required: true })
  userId: TObjectId;

  @prop({ required: true })
  treeId: TObjectId;

  @prop({ required: true })
  createdBy: TObjectId;

  @prop()
  updatedBy: TObjectId;

  @prop({ required: true })
  type: EType;
}
