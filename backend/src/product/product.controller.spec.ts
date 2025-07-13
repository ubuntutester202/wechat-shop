import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma.service';
import { ProductStatus } from '@prisma/client';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    search: jest.fn(),
    getCategories: jest.fn(),
    findByCategory: jest.fn(),
    findByMerchant: jest.fn(),
  };

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return product list', async () => {
      const mockResult = {
        products: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockProductService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll({
        page: 1,
        limit: 10,
        status: ProductStatus.PUBLISHED,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('获取商品列表成功');
    });
  });

  describe('findOne', () => {
    it('should return product detail', async () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Test Product',
        price: 1000,
        status: ProductStatus.PUBLISHED,
      };

      mockProductService.findById.mockResolvedValue(mockProduct);

      const result = await controller.findOne('test-id');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(result.message).toBe('获取商品详情成功');
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      const mockResult = {
        products: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockProductService.search.mockResolvedValue(mockResult);

      const result = await controller.search('test', { page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('搜索商品成功');
    });

    it('should return error when search term is empty', async () => {
      const result = await controller.search('', { page: 1, limit: 10 });

      expect(result.success).toBe(false);
      expect(result.data).toBe(null);
      expect(result.message).toBe('搜索关键词不能为空');
    });
  });

  describe('getCategories', () => {
    it('should return categories list', async () => {
      const mockCategories = ['Electronics', 'Clothing', 'Books'];
      mockProductService.getCategories.mockResolvedValue(mockCategories);

      const result = await controller.getCategories();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategories);
      expect(result.message).toBe('获取商品分类成功');
    });
  });
});
