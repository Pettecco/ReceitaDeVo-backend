import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Receita de Vó')
    .setDescription('API do blog de receitas - Receita de Vó')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  SwaggerModule.setup('docs', app, document);
  await app.listen(
    parseInt(process.env.PORT ?? '3000'),
    process.env.HOST ?? '0.0.0.0',
  );
}
bootstrap();
