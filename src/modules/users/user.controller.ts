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
import { CreateUserDto } from './dto/create.user.dto';
import { SetPasswordUserDto } from './dto/setPassword.user.dto';
import { UserService } from './user.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { FORBIDDEN } from 'src/errors/error.consts';
import { handleError } from 'src/utils/handleError';

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getAllUsers(@Session() session: Record<string, any>) {
    const { userId, ownerId } = session;
    return await this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.userSevice.getAllUsers(ownerId),
    );
  }

  @Get(':id')
  @UseGuards(JWTGuard)
  async getUser(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const { userId } = session;
    return this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.userSevice.getUserById(id),
    );
  }

  @Post()
  @UseGuards(JWTGuard)
  async createRole(
    @Body() dto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const { userId, ownerId } = session;
    return this.userSevice.execAfterUserCheckPermission(
      userId,
      'administrationPermission',
      () => this.userSevice.createUser(dto, ownerId),
    );
  }

  @Post('set-password')
  @UseGuards(JWTGuard)
  @UsePipes(ValidationPipe)
  async setPassword(
    @Body() dto: SetPasswordUserDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    return this.userSevice.setPassword({ userId, password: dto.password });
  }
}
