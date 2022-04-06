import { Length } from 'class-validator';

export class CreateOrUpdateRoleDto {
  @Length(2, 50, {
    message: 'Наименование роли должно содержать от 2 до 50 символов',
  })
  name: string;

  description?: string;

  administrationPermission: boolean;

  operationPermission: boolean;

  billingPermission: boolean;
}
