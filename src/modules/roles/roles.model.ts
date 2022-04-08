import { index, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BaseWithOwnerId } from 'src/types';

export interface RoleModel extends BaseWithOwnerId {}

@index({ name: 1, ownerId: 1 }, { unique: true })
export class RoleModel extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true, default: false })
  administrationPermission: boolean;

  @prop({ required: true, default: false })
  operationPermission: boolean;

  @prop({ required: true, default: false })
  billingPermission: boolean;

  @prop({ required: true, default: false })
  isOwner: boolean;

  @prop({ required: true })
  ownerId: string;
}
