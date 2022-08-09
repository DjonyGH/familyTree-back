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

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionSevice: PermissionService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getPermission(@Session() session: Record<string, any>) {
    console.log('controller: get permission by user id');
    const { userId } = session;
    return this.permissionSevice.getPermissionByUserId(userId);
  }

  @Post()
  @UseGuards(JWTGuard)
  async createPermission(
    @Body() dto: CreatePermissionDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const { userId } = session;
      return this.permissionSevice.createPermission(dto, userId);
    } catch (error) {
      console.log(error);
    }
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const { userId } = session;
      return this.permissionSevice.updatePermission(dto, userId, id);
    } catch (error) {
      console.log(error);
    }
  }
}
