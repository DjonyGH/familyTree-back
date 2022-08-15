import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

@index({ login: 1 }, { unique: true })
export class UserModel extends TimeStamps {
  @prop({ required: true })
  login: string;

  @prop()
  password: string;

  @prop()
  name?: string;

  @prop()
  surname?: string;

  @prop()
  patronymic?: string;

  @prop()
  email?: string;

  @prop()
  phone?: string;

  @prop()
  isBlocked: boolean;
}
