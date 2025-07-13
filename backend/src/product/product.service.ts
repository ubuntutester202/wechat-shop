import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product, ProductStatus, Prisma } from '@prisma/client';
import { ProductQueryDto, ProductListResponseDto, ProductResponseDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto): Promise<ProductListResponseDto> {
    const {
      search,
      category,
      status = ProductStatus.PUBLISHED,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      merchantId,
    } = query;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: Prisma.ProductWhereInput = {
      status,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(merchantId && { merchantId }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    };

    // 构建排序条件
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // 优化查询，只选择必要字段
    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      description: true,
      price: true,
      originalPrice: true,
      stock: true,
      images: true,
      category: true,
      tags: true,
      status: true,
      salesCount: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      merchantId: true,
      merchant: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products: products as ProductResponseDto[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string, includeSpecs = false): Promise<ProductResponseDto> {
    const select: Prisma.ProductSelect = {
      id: true,
      name: true,
      description: true,
      price: true,
      originalPrice: true,
      stock: true,
      images: true,
      category: true,
      tags: true,
      status: true,
      salesCount: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      merchantId: true,
      merchant: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      ...(includeSpecs && {
        specs: {
          select: {
            id: true,
            name: true,
            value: true,
            priceAdjustment: true,
            stock: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      }),
    };

    const product = await this.prisma.product.findUnique({
      where: { id },
      select,
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product as ProductResponseDto;
  }

  async search(searchTerm: string, options: Partial<ProductQueryDto> = {}): Promise<ProductListResponseDto> {
    return this.findAll({
      ...options,
      search: searchTerm,
    });
  }

  async findByCategory(category: string, options: Partial<ProductQueryDto> = {}): Promise<ProductListResponseDto> {
    return this.findAll({
      ...options,
      category,
    });
  }

  async findByMerchant(merchantId: string, options: Partial<ProductQueryDto> = {}): Promise<ProductListResponseDto> {
    return this.findAll({
      ...options,
      merchantId,
    });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return categories
      .map((item) => item.category)
      .filter((category): category is string => category !== null);
  }
}
