import { ProductStatus } from '@prisma/client';

export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images?: any;
  category?: string;
  tags?: any;
  status: ProductStatus;
  salesCount: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  merchantId: string;
  merchant?: {
    id: string;
    nickname?: string;
    avatar?: string;
  };
  specs?: ProductSpecResponseDto[];
}

export class ProductSpecResponseDto {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductListResponseDto {
  products: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}