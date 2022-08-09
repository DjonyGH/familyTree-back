import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { CreatePermissionDto } from './dto/create.permission.dto';
import { UpdatePermissionDto } from './dto/update.permission.dto';
import { mongoose } from '@typegoose/typegoose';
import { ObjectId, Types } from 'mongoose';
import { TObjectId } from 'src/types';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionSevice: PermissionService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getAllPermissions(@Session() session: Record<string, any>) {
    const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
    return this.permissionSevice.getAllPermissionsByUserId(userId);
  }

  @Post()
  @UseGuards(JWTGuard)
  async createPermission(
    @Body() dto: CreatePermissionDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
      return this.permissionSevice.createPermission(dto, userId);
    } catch (error) {
      console.log(error);
    }
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updatePermission(
    @Param('id') _id: string,
    @Body() dto: UpdatePermissionDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const id: TObjectId = new mongoose.Types.ObjectId(_id);
      const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
      return this.permissionSevice.updatePermission(dto, userId, id);
    } catch (error) {
      console.log(error);
    }
  }
}
