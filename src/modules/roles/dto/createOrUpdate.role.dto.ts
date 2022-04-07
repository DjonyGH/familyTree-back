import { IsBoolean, Length } from 'class-validator';

export class CreateOrUpdateRoleDto {
  @Length(2, 50, {
    message: 'Наименование роли должно содержать от 2 до 50 символов',
  })
  name: string;

  description?: string;

  @IsBoolean()
  administrationPermission: boolean;

  @IsBoolean()
  operationPermission: boolean;

  @IsBoolean()
  billingPermission: boolean;
}
