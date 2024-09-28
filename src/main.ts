import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalInterceptors } from './interceptors/global.interceptors';
import { GlobalExceptionFilter } from './exception/global.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Member & Book')
    .setDescription('Library management API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new GlobalInterceptors());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
