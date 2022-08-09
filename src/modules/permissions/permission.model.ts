import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
// import { ObjectId } from 'mongoose';
import { EType } from './types';

export interface PermissionModel extends Base {}

// @index({ login: 1 }, { unique: true })
export class PermissionModel extends TimeStamps {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  treeId: string;

  @prop({ required: true })
  createdBy: string;

  @prop()
  updatedBy: string;

  @prop({ required: true })
  type: EType;
}
