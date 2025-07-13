import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    batchUpdate: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart data', async () => {
      const userId = 'user1';
      const mockCartData = {
        data: [],
        total: 0,
        itemCount: 0,
      };

      mockCartService.getCart.mockResolvedValue(mockCartData);

      const result = await controller.getCart(userId);

      expect(result).toEqual(mockCartData);
      expect(mockCartService.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const userId = 'user1';
      const addCartItemDto = {
        productId: 'product1',
        quantity: 2,
      };
      const mockCartItem = {
        id: 'cart1',
        productId: 'product1',
        name: 'Test Product',
        price: 10000,
        image: 'image1.jpg',
        quantity: 2,
      };

      mockCartService.addItem.mockResolvedValue(mockCartItem);

      const result = await controller.addItem(userId, addCartItemDto);

      expect(result).toEqual({
        success: true,
        data: mockCartItem,
        message: 'Item added to cart successfully',
      });
      expect(mockCartService.addItem).toHaveBeenCalledWith(userId, addCartItemDto);
    });
  });

  describe('updateItem', () => {
    it('should update cart item', async () => {
      const userId = 'user1';
      const itemId = 'cart1';
      const updateCartItemDto = { quantity: 3 };
      const mockResponse = {
        success: true,
        message: 'Cart item updated successfully',
      };

      mockCartService.updateItem.mockResolvedValue(mockResponse);

      const result = await controller.updateItem(userId, itemId, updateCartItemDto);

      expect(result).toEqual(mockResponse);
      expect(mockCartService.updateItem).toHaveBeenCalledWith(
        userId,
        itemId,
        updateCartItemDto,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove cart item', async () => {
      const userId = 'user1';
      const itemId = 'cart1';
      const mockResponse = {
        success: true,
        message: 'Cart item removed successfully',
      };

      mockCartService.removeItem.mockResolvedValue(mockResponse);

      const result = await controller.removeItem(userId, itemId);

      expect(result).toEqual(mockResponse);
      expect(mockCartService.removeItem).toHaveBeenCalledWith(userId, itemId);
    });
  });

  describe('batchUpdate', () => {
    it('should batch update cart items', async () => {
      const userId = 'user1';
      const batchUpdateCartDto = {
        updates: [
          { id: 'cart1', quantity: 2 },
          { id: 'cart2', quantity: 3 },
        ],
      };
      const mockResponse = {
        success: true,
        message: 'Cart updated successfully',
      };

      mockCartService.batchUpdate.mockResolvedValue(mockResponse);

      const result = await controller.batchUpdate(userId, batchUpdateCartDto);

      expect(result).toEqual(mockResponse);
      expect(mockCartService.batchUpdate).toHaveBeenCalledWith(
        userId,
        batchUpdateCartDto,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      const userId = 'user1';
      const mockResponse = {
        success: true,
        message: 'Cart cleared successfully',
      };

      mockCartService.clearCart.mockResolvedValue(mockResponse);

      const result = await controller.clearCart(userId);

      expect(result).toEqual(mockResponse);
      expect(mockCartService.clearCart).toHaveBeenCalledWith(userId);
    });
  });
});