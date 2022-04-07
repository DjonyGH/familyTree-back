import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { CreateOrUpdateRoleDto } from './dto/createOrUpdate.role.dto';
import { UserService } from '../users/user.service';
import { FORBIDDEN } from 'src/errors/error.consts';
import { handleError } from 'src/utils/handleError';

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
        'administrationPermission',
      )
    ) {
      return this.roleSevice.getAllRoles(ownerId);
    } else {
      handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Get(':id')
  @UseGuards(JWTGuard)
  @UseGuards(JWTGuard)
  async getRoleById(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.getRoleById(id);
    } else {
      handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  @UseGuards(JWTGuard)
  async createRole(
    @Body() dto: CreateOrUpdateRoleDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.createRole(dto, ownerId);
    } else {
      handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: CreateOrUpdateRoleDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.updateRole(id, dto);
    } else {
      handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Delete(':id')
  @UseGuards(JWTGuard)
  async deleteRole(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    if (
      await this.userSevice.checkPermissionByUser(
        userId,
        'administrationPermission',
      )
    ) {
      return this.roleSevice.deleteRole(id);
    } else {
      handleError(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }
}
