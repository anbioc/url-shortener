import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshDTO } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guards';
import { currentUser } from './decorator/currentuser.decorator';
import { User } from './entity/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }

  async createAdmin() {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('verify-refresh')
  async refresh(@Body() dto: RefreshDTO) {
    return this.authService.refreshToken(dto.refreshtoken)    
  }

  @Get('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(@currentUser() user: User) {
    return this.authService.signOut(user)
  }
}
