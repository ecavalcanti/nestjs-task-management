import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthCrendentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<void> {
    return this.authService.signUp(authCrendentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCrendentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCrendentialsDto);
  }

}
