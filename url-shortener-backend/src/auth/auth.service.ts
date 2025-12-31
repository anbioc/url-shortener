import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, userRole } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDTO } from './dto/register.dto';
import {
  generateAccessToken,
  generateTokens,
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from 'src/lib/hash.util';
import { LoginDTO } from './dto/login.dto';
import { ref } from 'process';
import { date } from 'joi';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getCurrentUserById(sub: any) {
    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async register(dto: RegisterDTO) {
    // first check the user
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      return {
        success: false,
        message: 'user already registered',
        data: null,
      };
    }
    // hash password
    const hashedPassword = await hashPassword(dto.password);

    const newUser = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullname: dto.fullname,
      role: userRole.USER,
    });

    const result = await this.userRepository.save(newUser);

    const { password, ...response } = result;

    return {
      success: true,
      data: response,
      message: 'User registered',
    };
  }

  async login(dto: LoginDTO) {
    // find the user, if not failure
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'user not found',
        data: null,
      };
    }

    if (!user.refreshToken) {
      return {
        success: false,
        message: 'No refresh token, please login again',
        data: null,
      };
    }
    // compare passwrods,
    if (!(await verifyPassword(user.password, dto.password))) {
      return {
        success: false,
        message: "passwords dosn't match",
        data: null,
      };
    }
    // generate token
    const token = await generateTokens(
      user,
      this.jwtService,
      this.configService,
    );

    const u = await this.userRepository.update(
      {
        id: user.id,
      },
      {
        refreshToken: token.refreshToken,
      },
    );

    const { password, refreshToken, ...result } = user;

    return {
      success: true,
      data: {
        user: result,
        ...token,
      },
      message: 'Login success',
    };
  }

  async refreshToken(refresh: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        refreshToken: refresh,
      },
    });

    if (!user) {
      console.log('Cant find user with refresh, please login again');
      throw new UnauthorizedException(
        'Cant find user with refresh, please login again',
      );
    }

    if (user.refreshToken != refresh) {
      throw new UnauthorizedException(
        'Wrong refresh token, please login again',
      );
    }

    const result = await verifyRefreshToken(
      this.jwtService,
      this.configService,
      refresh,
    );

    console.log(`result of refresh: ${JSON.stringify(result)}`);
     const token = await generateTokens(
      user,
      this.jwtService,
      this.configService,
    );
    if (result.success) {
      return {
        success: true,
        data: {
          ...token
        },
        error: null
      };
    } else {
      return result;
    }
  }

  async signOut(user: User) {
    try {
      const query = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          refreshToken: '',
        },
      );

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (e) {
      console.error(`Can't sign out: ${e.message}`);
      return {
        success: false,
        data: null,
        error: e.message,
      };
    }
  }
}
