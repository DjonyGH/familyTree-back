import {
  Body,
  Controller,
  Delete,
  Get,
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
    return this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.roleSevice.getAllRoles(ownerId),
    );
  }

  @Get(':id')
  @UseGuards(JWTGuard)
  @UseGuards(JWTGuard)
  async getRoleById(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    return this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.roleSevice.getRoleById(id),
    );
  }

  @Post()
  @UseGuards(JWTGuard)
  async createRole(
    @Body() dto: CreateOrUpdateRoleDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    return this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.roleSevice.createRole(dto, ownerId),
    );
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: CreateOrUpdateRoleDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    const isOwner = userId === ownerId;
    return await this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.roleSevice.updateRole(id, dto, isOwner),
    );
  }

  @Delete(':id')
  @UseGuards(JWTGuard)
  async deleteRole(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    return await this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.roleSevice.deleteRole(id),
    );
  }
}
