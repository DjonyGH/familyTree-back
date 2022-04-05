import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { SetPasswordUserDto } from './dto/setPassword.user.dto';
import { USER_NOT_FOUND } from '../../errors/error.consts';
import { UserService } from './user.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userSevice.createUser(dto);
  }

  @Get()
  @UseGuards(JWTGuard)
  async findUser(@Query('login') login: string) {
    const user = await this.userSevice.findUser(login);
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    } else {
      return user;
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
