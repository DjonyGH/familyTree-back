import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() dto: AuthDto) {
    return this.authSevice.login(dto);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Body() dto: { refreshToken: string }) {
    return this.authSevice.logout(dto.refreshToken);
  }
}
