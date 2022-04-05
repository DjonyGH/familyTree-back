import { Body, Controller, Post } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.tokenService.refresh(dto);
  }
}
