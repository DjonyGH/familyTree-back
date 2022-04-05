import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsPhoneNumber('RU', { message: 'Это не телефонный номер' })
  login: string;

  @IsString()
  name?: string;

  @IsEmail()
  email?: string;
}
