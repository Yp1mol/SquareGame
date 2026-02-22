import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body : any) {
    return this.auth.login(body.username, body.password);
  }

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return this.auth.register(body.username, body.password);
  }
}