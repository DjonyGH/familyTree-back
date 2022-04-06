import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { USER_NOT_AUTH } from 'src/errors/error.consts';

declare module 'express-session' {
  interface Session {
    userId: string;
    ownerId: string;
  }
}

const configService = new ConfigService();
const jwtService = new JwtService({
  secret: configService.get('JWT_SECRET_KEY'),
});

export function user(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const user = jwtService.verify(token);
      req.session.userId = user.id;
      req.session.ownerId = user.ownerId;
    } catch (error) {
      throw new HttpException(USER_NOT_AUTH, HttpStatus.NOT_FOUND);
    }
  }
  next();
}
