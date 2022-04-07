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

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userSevice.createUser(dto);
  }

  @Get(':id')
  @UseGuards(JWTGuard)
  async getUser(
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
      return this.userSevice.getUserById(id);
    } else {
      throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
    }
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
