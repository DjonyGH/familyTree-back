import { IsEmail, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @Matches(/^[0-9a-fA-F]{24}$/)
  roleId: string;
}
