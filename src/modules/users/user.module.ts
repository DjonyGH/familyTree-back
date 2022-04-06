import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { RoleModule } from '../roles/roles.module';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'users',
        },
      },
    ]),
    RoleModule,
    MyJwtModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
