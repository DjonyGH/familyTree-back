import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { TreeController } from './tree.controller';
import { TreeModel } from './tree.model';
import { TreeService } from './tree.service';

@Module({
  controllers: [TreeController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TreeModel,
        schemaOptions: {
          collection: 'trees',
        },
      },
    ]),
    PermissionModule,
    MyJwtModule,
  ],
  providers: [TreeService],
  exports: [TreeService],
})
export class TreeModule {}
