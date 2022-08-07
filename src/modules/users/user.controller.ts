import {
  Body,
  Controller,
  Get,
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

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  // @Get()
  // @UseGuards(JWTGuard)
  // async getAllUsers() {}

  // Возвращает юзера, его пермишены и деревья доступнеы ему
  @Get(':id')
  @UseGuards(JWTGuard)
  async getUser() {}

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
