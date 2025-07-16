import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PayModule } from './pay/pay.module';
import { loggerConfig, productionLoggerConfig } from './config/logger.config';
import { AppLoggerService } from './common/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
    }),
    WinstonModule.forRoot(
      process.env.NODE_ENV === 'production' 
        ? productionLoggerConfig 
        : loggerConfig
    ),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 秒
        limit: 3, // 每秒最多 3 个请求
      },
      {
        name: 'medium',
        ttl: 10000, // 10 秒
        limit: 20, // 每 10 秒最多 20 个请求
      },
      {
        name: 'long',
        ttl: 60000, // 1 分钟
        limit: 100, // 每分钟最多 100 个请求
      },
    ]),
    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    OrderModule,
    PayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AppLoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

/**
 * 根据环境变量选择配置文件
 */
function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'production') {
    return '.env.prod';
  } else if (process.env.DOCKER_ENV === 'true' || process.env.DATABASE_URL?.includes('postgres:5432')) {
    return '.env.docker';
  } else {
    return '.env.dev';
  }
}
