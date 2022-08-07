import { UserModel } from './user.model';

export interface IUserResponse
  extends Omit<UserModel, 'password' | 'ownerId' | 'roleId'> {}

export type TPermission =
  | 'administrationPermission'
  | 'operationPermission'
  | 'billingPermission';
