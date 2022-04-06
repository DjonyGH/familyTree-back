import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { UserModule } from '../users/user.module';
import { RoleController } from './roles.controller';
import { RoleModel } from './roles.model';
import { RoleService } from './roles.service';

@Module({
  controllers: [RoleController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
        schemaOptions: {
          collection: 'roles',
        },
      },
    ]),
    forwardRef(() => UserModule),
    MyJwtModule,
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
