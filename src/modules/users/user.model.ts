import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true, required: true })
  login: string;

  @prop()
  name?: string;

  @prop()
  email?: string;

  @prop()
  password: string;

  @prop()
  isBlocked: boolean;
}
