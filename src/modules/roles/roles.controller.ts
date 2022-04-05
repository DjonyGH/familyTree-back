import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JWTGuard } from 'src/jwt/jwt.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesSevice: RolesService) {}

  @Post()
  async createRoles() {}

  @Get()
  @UseGuards(JWTGuard)
  async findRoles() {}
}
