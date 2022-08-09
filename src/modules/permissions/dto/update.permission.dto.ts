import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { EType } from '../types';

export class UpdatePermissionDto {
  @IsEnum(EType, { each: true, message: 'Неверный тип права доступа' })
  type?: EType;
}
