import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import {
  TOKEN_ERROR,
  TOKEN_NOT_FOUND,
  TOKEN_REVOKED,
} from 'src/errors/error.consts';
import { UserModel } from '../users/user.model';
import { UserService } from '../users/user.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { TokenModel } from './token.model';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
  login: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel) private readonly tokenModel: ModelType<TokenModel>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(user: UserModel): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
      name: user.name,
      isblocked: user.isBlocked,
    };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(
    user: UserModel,
    expiresIn: number,
  ): Promise<string> {
    const refreshToken = await this.createRefreshToken(user, expiresIn);
    const payload = {
      login: user.login,
      isblocked: user.isBlocked,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn,
      subject: String(user.id),
      jwtid: String(refreshToken.id),
    });
  }

  async createRefreshToken(user: UserModel, ttl: number): Promise<TokenModel> {
    const token = new TokenModel();
    token.login = user.login;
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);
    token.expires = expiration;
    return this.tokenModel.create(token);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserModel; token: TokenModel }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
    if (!token) {
      throw new HttpException(TOKEN_NOT_FOUND, HttpStatus.FORBIDDEN);
    }
    if (token.isRevoked) {
      throw new HttpException(TOKEN_REVOKED, HttpStatus.FORBIDDEN);
    }
    const user = await this.getUserFromRefreshTokenPayload(payload);
    if (!user) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
    return { user, token };
  }

  async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verify(token);
    } catch (e) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<TokenModel> | null {
    const tokenId = payload.jti;
    if (!tokenId) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
    return this.tokenModel.findOne({ _id: tokenId });
  }

  async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<UserModel> {
    const userSubLogin = payload.login;
    if (!userSubLogin) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
    return this.userService.findUser(userSubLogin);
  }

  async refresh(
    dto: RefreshTokenDto,
  ): Promise<{ user: UserModel; accessToken: string }> {
    const { user, accessToken } = await this.createAccessTokenFromRefreshToken(
      dto.refreshToken,
    );
    user.password = undefined;
    return { user, accessToken };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ user: UserModel; accessToken: string }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const accessToken = await this.generateAccessToken(user);
    return { user, accessToken };
  }

  public async getUserIdFromToken(token: string): Promise<string> {
    const payload = await this.decodeRefreshToken(token);
    const user = await this.getUserFromRefreshTokenPayload(payload);
    if (!user) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
    return user.id;
  }

  async revokeRefreshToken(refreshToken: string) {
    const payload = await this.decodeRefreshToken(refreshToken);
    const tokenId = payload.jti;
    if (!tokenId) {
      throw new HttpException(TOKEN_ERROR, HttpStatus.FORBIDDEN);
    }
    return this.tokenModel.updateOne({ _id: tokenId }, { isRevoked: true });
  }
}
