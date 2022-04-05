import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    HttpModule,
    ConfigModule,
    TokenModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: AuthModel,
        schemaOptions: {
          collection: 'auth',
        },
      },
    ]),
  ],
  providers: [AuthService],
})
export class AuthModule {}
