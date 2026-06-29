import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'libs/common/filters/http-exception.filter';
import { ResponseInterceptor } from 'libs/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {


  
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
);

app.enableCors()

app.useGlobalInterceptors(
    new ResponseInterceptor(),
);

app.useGlobalPipes(
    new ValidationPipe({

        whitelist: true,

        transform: true,

        forbidNonWhitelisted: true,

    }),
);
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
