import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cartItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    productSpec: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart with items', async () => {
      const userId = 'user1';
      const mockCartItems = [
        {
          id: 'cart1',
          quantity: 2,
          product: {
            id: 'product1',
            name: 'Test Product',
            price: 10000,
            images: ['image1.jpg'],
            status: 'PUBLISHED',
          },
          spec: null,
        },
      ];

      mockPrismaService.cartItem.findMany.mockResolvedValue(mockCartItems);

      const result = await service.getCart(userId);

      expect(result).toEqual({
        data: [
          {
            id: 'cart1',
            productId: 'product1',
            name: 'Test Product',
            price: 10000,
            image: 'image1.jpg',
            quantity: 2,
            selectedVariants: undefined,
            spec: undefined,
          },
        ],
        total: 20000,
        itemCount: 2,
      });
    });

    it('should return empty cart', async () => {
      const userId = 'user1';
      mockPrismaService.cartItem.findMany.mockResolvedValue([]);

      const result = await service.getCart(userId);

      expect(result).toEqual({
        data: [],
        total: 0,
        itemCount: 0,
      });
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', async () => {
      const userId = 'user1';
      const addCartItemDto = {
        productId: 'product1',
        quantity: 2,
      };

      const mockProduct = {
        id: 'product1',
        name: 'Test Product',
        price: 10000,
        stock: 10,
        status: 'PUBLISHED',
        specs: [],
      };

      const mockCartItem = {
        id: 'cart1',
        quantity: 2,
        product: {
          id: 'product1',
          name: 'Test Product',
          price: 10000,
          images: ['image1.jpg'],
        },
        spec: null,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);

      const result = await service.addItem(userId, addCartItemDto);

      expect(result).toEqual({
        id: 'cart1',
        productId: 'product1',
        name: 'Test Product',
        price: 10000,
        image: 'image1.jpg',
        quantity: 2,
        selectedVariants: undefined,
        spec: undefined,
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      const userId = 'user1';
      const addCartItemDto = {
        productId: 'nonexistent',
        quantity: 1,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.addItem(userId, addCartItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when product not published', async () => {
      const userId = 'user1';
      const addCartItemDto = {
        productId: 'product1',
        quantity: 1,
      };

      const mockProduct = {
        id: 'product1',
        status: 'DRAFT',
        specs: [],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.addItem(userId, addCartItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const userId = 'user1';
      const addCartItemDto = {
        productId: 'product1',
        quantity: 15,
      };

      const mockProduct = {
        id: 'product1',
        stock: 10,
        status: 'PUBLISHED',
        specs: [],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.addItem(userId, addCartItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateItem', () => {
    it('should update cart item quantity', async () => {
      const userId = 'user1';
      const itemId = 'cart1';
      const updateCartItemDto = { quantity: 3 };

      const mockCartItem = {
        id: 'cart1',
        quantity: 2,
        product: { stock: 10 },
        spec: null,
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue(mockCartItem);

      const result = await service.updateItem(userId, itemId, updateCartItemDto);

      expect(result).toEqual({
        success: true,
        message: 'Cart item updated successfully',
      });
    });

    it('should throw NotFoundException when cart item not found', async () => {
      const userId = 'user1';
      const itemId = 'nonexistent';
      const updateCartItemDto = { quantity: 3 };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.updateItem(userId, itemId, updateCartItemDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should remove cart item', async () => {
      const userId = 'user1';
      const itemId = 'cart1';

      const mockCartItem = { id: 'cart1' };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem);

      const result = await service.removeItem(userId, itemId);

      expect(result).toEqual({
        success: true,
        message: 'Cart item removed successfully',
      });
    });

    it('should throw NotFoundException when cart item not found', async () => {
      const userId = 'user1';
      const itemId = 'nonexistent';

      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.removeItem(userId, itemId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all cart items', async () => {
      const userId = 'user1';

      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clearCart(userId);

      expect(result).toEqual({
        success: true,
        message: 'Cart cleared successfully',
      });
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});