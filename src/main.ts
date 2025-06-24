
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { TransformInterceptor } from './transform.interceptor'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //1

  app.enableVersioning({ //2
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.useGlobalPipes(new ValidationPipe({//3
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));//4

  app.useGlobalInterceptors(new TransformInterceptor()); 

  const config = new DocumentBuilder()//5
    .setTitle('API de Raquetes de Beach Tennis')
    .setDescription('Documentação da API para gerenciamento de raquetes de beach tennis')
    .setVersion('1.0')
    .addTag('rackets')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);//6
}
bootstrap();