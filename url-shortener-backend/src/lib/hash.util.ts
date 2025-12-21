import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entity/user.entity';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function generateTokens(
  user: User,
  jwtService: JwtService,
  configService: ConfigService,
) {
  return {
    accessToken: generateAccessToken(user, jwtService, configService),
    refreshToken: generateRefreshToken(user, jwtService, configService),
  };
}

export function generateAccessToken(
  user: User,
  jwtService: JwtService,
  configService: ConfigService,
): string {
  const payload = {
    email: user.email,
    sub: user.id,
    role: user.role,
  };

  return jwtService.sign(payload, {
    expiresIn: '30m',
    secret: configService.get<string>('JWT_SECRET'),
  });
}

export function generateRefreshToken(
  user: User,
  jwtService: JwtService,
  configService: ConfigService,
) {
  const payload = {
    sub: user.id,
  };

  return jwtService.sign(payload, {
    secret: configService.get<string>('JWT_REFRESH_SECRET'),
    expiresIn: '3d',
  });
}

export async function verifyRefreshToken(
  jwtService: JwtService,
  configService: ConfigService,
  refreshToken: string,
) {
  try {
    const result = jwtService.verify(refreshToken, {
      secret: configService.get<string>('JWT_REFRESH_SECRET'),
    });
    console.log(`decoded refresh token: ${JSON.stringify(result)}`)
    return {
      success: true,
      data: {
        userId: result.sub
      },
      error: null
    };
  } catch (e: any) {
    console.error(`Can't verify refresh token: ${e.message}`);
       return {
      success: false,
      data: null,
      error: `Please login, can't decode the refresh token: ${e.message}`
    };
  }
}
