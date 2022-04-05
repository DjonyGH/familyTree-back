import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { TokenModule } from '../token/token.module';
import { RolesController } from './roles.controller';
import { RoleModel } from './roles.model';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
        schemaOptions: {
          collection: 'roles',
        },
      },
    ]),
    MyJwtModule,
  ],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
