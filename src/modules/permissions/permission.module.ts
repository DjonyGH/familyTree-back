import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { PermissionController } from './permission.controller';
import { PermissionModel } from './permission.model';
import { PermissionService } from './permission.service';

@Module({
  controllers: [PermissionController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PermissionModel,
        schemaOptions: {
          collection: 'permissions',
        },
      },
    ]),
    MyJwtModule,
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
