import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
    }),
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
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
