import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { SetPasswordUserDto } from './dto/setPassword.user.dto';
import { UserService } from './user.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UpdateUserDto } from './dto/update.user.dto';
import { USER_FORBIDDEN } from 'src/errors/error.consts';

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  // Возвращает юзера и деревья доступнеы ему с уровнем доступа
  @Get(':id')
  @UseGuards(JWTGuard)
  async getUser(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    console.log('controller: get user by id');
    const { userId } = session;
    if (id === userId) {
      return this.userSevice.getUserById(userId);
    } else {
      throw new HttpException(USER_FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  @UseGuards(JWTGuard)
  async createUser() {}

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateUser() {}

  @Post('set-password')
  @UseGuards(JWTGuard)
  @UsePipes(ValidationPipe)
  async setPassword() {}
}
