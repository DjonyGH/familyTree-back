import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface BaseWithOwnerId extends Base {
  ownerId: string;
}
