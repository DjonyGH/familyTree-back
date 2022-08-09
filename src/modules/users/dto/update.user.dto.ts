import { IsEmail, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;
}
