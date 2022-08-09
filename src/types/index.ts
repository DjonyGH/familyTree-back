import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface BaseWithOwnerId extends Base {
  ownerId: string;
}

export type TObjectId = Types.ObjectId;
