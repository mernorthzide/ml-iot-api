import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailPasswordSignInDto } from './dto/email-password-sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in with email and password',
  })
  signIn(@Body() signInDto: EmailPasswordSignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
