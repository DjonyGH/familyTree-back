import { IsEnum, Length } from 'class-validator';
import { EType } from 'src/modules/permissions/types';

export class UpdateTreeDto {
  @Length(50)
  name: string;

  @IsEnum(EType, { each: true, message: 'Неверный тип права доступа' })
  typePermission?: EType;
}
