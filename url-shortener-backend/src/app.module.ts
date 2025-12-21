import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { UrlModule } from './url/url.module';
import { Url } from './url/entity/url.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: joi.object({
        APP_NAME: joi.string().default('Test nestjs'),
      }),
      // load: [appConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://mac@localhost:5432/template1',
      synchronize: true, // * * * * set false in production * * * *
      entities: [User, Url],
    }),
    UrlModule,
  ],
})
export class AppModule {}
