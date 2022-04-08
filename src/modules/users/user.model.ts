import { index, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BaseWithOwnerId } from 'src/types';

export interface UserModel extends BaseWithOwnerId {}

@index({ login: 1, ownerId: 1 }, { unique: true })
export class UserModel extends TimeStamps {
  @prop({ required: true })
  login: string;

  @prop()
  password: string;

  @prop()
  name?: string;

  @prop()
  email?: string;

  @prop()
  isBlocked: boolean;

  @prop({ required: true })
  ownerId: string;

  @prop({ required: true })
  roleId: string;
}
