import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateOrUpdateRoleDto } from './dto/createOrUpdate.role.dto';
import { UserService } from '../users/user.service';
import { FORBIDDEN } from 'src/errors/error.consts';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleSevice: RoleService,
    private readonly userSevice: UserService,
  ) {}

  @Get()
  @UseGuards(JWTGuard)
  @UseGuards(JWTGuard)
  async getAllRoles(@Session() session: Record<string, any>) {
    const { userId, ownerId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        ownerId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.getAllRoles(ownerId);
    } else {
      throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Get(':id')
  @UseGuards(JWTGuard)
  @UseGuards(JWTGuard)
  async getRoleById(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        ownerId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.getRoleById(id);
    } else {
      throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  @UseGuards(JWTGuard)
  @UsePipes(ValidationPipe)
  async createRole(
    @Body() dto: CreateOrUpdateRoleDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        ownerId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.createRole(dto, ownerId);
    } else {
      throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }
}
