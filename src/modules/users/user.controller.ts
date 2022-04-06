import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
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

  @Get(':id')
  @UseGuards(JWTGuard)
  async getUser(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const ownerId = session.ownerId;
    console.log('id', id);

    return this.userSevice.getUserById(id, ownerId);
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
