import { Matches, IsEnum } from 'class-validator';
import { EType } from '../types';

export class CreatePermissionDto {
  @Matches(/^[0-9a-fA-F]{24}$/)
  userId: string;

  @Matches(/^[0-9a-fA-F]{24}$/)
  treeId: string;

  @IsEnum(EType, { each: true, message: 'Неверный тип права доступа' })
  type?: EType;
}
