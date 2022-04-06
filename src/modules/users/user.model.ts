import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BaseWithOwnerId } from 'src/types';

export interface UserModel extends BaseWithOwnerId {}

export class UserModel extends TimeStamps {
  @prop({ unique: true, required: true })
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
