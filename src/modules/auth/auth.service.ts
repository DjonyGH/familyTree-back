import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { compare } from 'bcrypt';
import { LOGIN_OR_PASSWORD_ERROR } from 'src/errors/error.consts';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto) {
    const { login, password } = dto;
    const user = await this.userService.findUser(login);

    if (user) {
      const checkPassword =
        user.password && (await compare(password, user.password));

      if (checkPassword) {
        const accessToken = await this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(
          user,
          1000 * 60 * 60 * 24 * 15,
        );
        user.password = undefined;
        return {
          user,
          accessToken,
          refreshToken,
        };
      }
    }
    throw new HttpException(LOGIN_OR_PASSWORD_ERROR, HttpStatus.NOT_FOUND);
  }

  async logout(refreshToken: string) {
    return this.tokenService.revokeRefreshToken(refreshToken);
  }
}
