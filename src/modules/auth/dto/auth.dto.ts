import { Length } from 'class-validator';

export class AuthDto {
  @Length(3, 30, { message: 'Логин должен быть от 3 до 30 символов' })
  login: string;

  @Length(4, 12, { message: 'Пароль должен быть от 4 до 12 символов' })
  password: string;
}
