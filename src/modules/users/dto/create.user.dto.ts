import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(3, 30, { message: 'Логин должен быть от 3 до 30 символов' })
  login: string;

  @Length(4, 12, { message: 'Пароль должен быть от 4 до 12 символов' })
  password: string;

  name?: string;

  @IsEmail()
  email?: string;

  @Matches(/^[0-9a-fA-F]{24}$/)
  roleId: string;
}
