import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class ProductSpecResponseDto {
  @ApiProperty({ description: '规格ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: '规格名称', example: '颜色' })
  name: string;

  @ApiProperty({ description: '规格值', example: '深空黑色' })
  value: string;

  @ApiProperty({ description: '价格调整（分）', example: 0 })
  priceAdjustment: number;

  @ApiProperty({ description: '规格库存', example: 50 })
  stock: number;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class ProductResponseDto {
  @ApiProperty({ description: '商品ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: '商品名称', example: 'iPhone 15 Pro' })
  name: string;

  @ApiPropertyOptional({ description: '商品描述', example: '最新款iPhone，性能强劲' })
  description?: string;

  @ApiProperty({ description: '商品价格（分）', example: 999900 })
  price: number;

  @ApiPropertyOptional({ description: '原价（分）', example: 1099900 })
  originalPrice?: number;

  @ApiProperty({ description: '库存数量', example: 100 })
  stock: number;

  @ApiPropertyOptional({ description: '商品图片', example: ['image1.jpg', 'image2.jpg'] })
  images?: any;

  @ApiPropertyOptional({ description: '商品分类', example: 'Electronics' })
  category?: string;

  @ApiPropertyOptional({ description: '商品标签', example: ['热销', '新品'] })
  tags?: any;

  @ApiProperty({ description: '商品状态', enum: ProductStatus, example: ProductStatus.PUBLISHED })
  status: ProductStatus;

  @ApiProperty({ description: '销售数量', example: 1250 })
  salesCount: number;

  @ApiPropertyOptional({ description: '商品评分', example: 4.8 })
  rating?: number;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '商家ID', example: 'uuid-string' })
  merchantId: string;

  @ApiPropertyOptional({ 
    description: '商家信息',
    type: 'object',
    properties: {
      id: { type: 'string', description: '商家ID', example: 'uuid-string' },
      nickname: { type: 'string', description: '商家昵称', example: '苹果官方旗舰店' },
      avatar: { type: 'string', description: '商家头像', example: 'avatar.jpg' }
    }
  })
  merchant?: {
    id: string;
    nickname?: string;
    avatar?: string;
  };

  @ApiPropertyOptional({ description: '商品规格', type: [ProductSpecResponseDto] })
  specs?: ProductSpecResponseDto[];
}

export class ProductListResponseDto {
  @ApiProperty({ description: '商品列表', type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ description: '总数量', example: 100 })
  total: number;

  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  limit: number;

  @ApiProperty({ description: '总页数', example: 10 })
  totalPages: number;
}