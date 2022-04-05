import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { user } from './middleware/user.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://185.96.163.68', 'http://localhost:3001'] });
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(user);
  await app.listen(3000);
}
bootstrap();
