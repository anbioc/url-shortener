import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const secretKey = configService.get('JWT_SECRET')
      ? configService.get('JWT_SECRET')
      : '';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.getCurrentUserById(payload.sub);

      return {
        id: user.id,
        role: user.role,
        email: user.email,
        fullname: user.fullname,
      };
    } catch (e) {
        console.error(e);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
