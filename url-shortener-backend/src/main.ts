import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, 
    {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Enable all
  }
  );
  app.set('query parser', 'extended');
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove props that don't have decorators.
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payload that to be objects pipe according to their DTO classes
      disableErrorMessages: false,
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
