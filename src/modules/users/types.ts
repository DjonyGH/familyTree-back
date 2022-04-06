import { RoleModel } from '../roles/roles.model';
import { UserModel } from './user.model';

export interface IUserResponse
  extends Omit<UserModel, 'password' | 'ownerId' | 'roleId'> {
  role: RoleModel;
}

export type TPermission =
  | 'administrationPermission'
  | 'operationPermission'
  | 'billingPermission';
