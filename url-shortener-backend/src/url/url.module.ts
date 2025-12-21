import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { User } from 'src/auth/entity/user.entity';
import { Url } from './entity/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UrlController],
  providers: [UrlService],
  imports: [
        TypeOrmModule.forFeature([User, Url]),
        PassportModule,
        JwtModule.register({}),
  ]
})
export class UrlModule {}
