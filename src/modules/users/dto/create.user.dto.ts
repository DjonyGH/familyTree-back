import { IsPhoneNumber, Length } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber('RU', { message: 'Это не телефонный номер' })
  login: string;

  @Length(6, 12, { message: 'Пароль должен быть от 6 до 12 символов' })
  password: string;
}
