import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { UserModule } from './modules/users/user.module';
import { TokenModule } from './modules/token/token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PermissionModule } from './modules/permissions/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    TokenModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
