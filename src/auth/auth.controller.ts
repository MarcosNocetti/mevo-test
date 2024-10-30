import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')

  async login(@Body() req: User) {
    return this.authService.signIn(req.name, req.password);
  }
}
