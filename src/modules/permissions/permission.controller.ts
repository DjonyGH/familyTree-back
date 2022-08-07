import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.permission.dto';
import { PermissionService } from './permission.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UpdateUserDto } from './dto/update.permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionSevice: PermissionService) {}

  @Post()
  @UseGuards(JWTGuard)
  async createPermission() {}

  @Put(':id')
  @UseGuards(JWTGuard)
  async updatePermission() {}
}
