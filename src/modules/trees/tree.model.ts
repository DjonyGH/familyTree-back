import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { TObjectId } from 'src/types';

export interface TreeModel extends Base {}

export class TreeModel extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  createdBy: TObjectId;

  @prop()
  updatedBy: TObjectId;
}
