import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
