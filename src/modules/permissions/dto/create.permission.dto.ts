import { Matches, IsEnum } from 'class-validator';
import { ObjectId } from 'mongoose';
import { TObjectId } from 'src/types';
import { EType } from '../types';

export class CreatePermissionDto {
  @Matches(/^[0-9a-fA-F]{24}$/)
  userId: TObjectId;

  @Matches(/^[0-9a-fA-F]{24}$/)
  treeId: TObjectId;

  @IsEnum(EType, { each: true, message: 'Неверный тип права доступа' })
  type?: EType;
}
