import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserModule } from '../users/user.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { TokenModel } from './token.model';
import { JwtModule } from '@nestjs/jwt';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { MyJwtModule } from 'src/jwt/myJwt.module';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
    UserModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: TokenModel,
        schemaOptions: {
          collection: 'tokens',
        },
      },
    ]),
    MyJwtModule,
  ],
  exports: [TokenService],
})
export class TokenModule {}
