import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface TokenModel extends Base {}

export class TokenModel extends TimeStamps {
  @prop()
  login: string;

  @prop()
  isRevoked: boolean;

  @prop()
  expires: Date;
}
