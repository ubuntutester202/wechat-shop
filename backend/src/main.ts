import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });
  
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger API 文档配置
  const config = new DocumentBuilder()
    .setTitle('在线销售平台 API')
    .setDescription('微信小程序在线销售平台的后端API文档')
    .setVersion('1.0')
    .addTag('用户管理', '用户注册、登录、个人信息管理')
    .addTag('商品管理', '商品列表、详情、搜索、分类')
    .addTag('购物车', '购物车增删改查')
    .addTag('订单管理', '订单创建、查询、状态管理')
    .addTag('支付', '微信支付相关接口')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger API documentation: http://localhost:${port}/api`);
  await app.listen(port);
}
bootstrap();
