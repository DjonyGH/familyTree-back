import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './roles.service';
import { JWTGuard } from 'src/jwt/jwt.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleSevice: RoleService) {}

  @Post()
  async createRoles() {}

  @Get()
  @UseGuards(JWTGuard)
  async findRoles() {}
}
