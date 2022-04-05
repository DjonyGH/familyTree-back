import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface RoleModel extends Base {}

export class RoleModel extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;
}
