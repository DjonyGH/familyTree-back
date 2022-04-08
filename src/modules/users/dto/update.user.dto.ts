import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @Length(3, 30, { message: 'Логин должен быть от 3 до 30 символов' })
  login: string;

  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @Matches(/^[0-9a-fA-F]{24}$/)
  roleId: string;
}
