import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards';
import {
  OrderCalculationRequestDto,
  OrderCalculationResponseDto,
  CreateOrderRequestDto,
} from './dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    calculateOrder: jest.fn(),
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    cancelOrder: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculateOrder', () => {
    it('should calculate order total', async () => {
      const dto: OrderCalculationRequestDto = {
        items: [
          {
            productId: '1',
            quantity: 1,
            price: 100,
          },
        ],
      };

      const expectedResult: OrderCalculationResponseDto = {
        subtotal: 100,
        shipping: 0,
        discount: 0,
        total: 100,
        shippingMethod: '免费配送',
      };

      mockOrderService.calculateOrder.mockResolvedValue(expectedResult);

      const result = await controller.calculateOrder(dto);

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.calculateOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const dto: CreateOrderRequestDto = {
        items: [
          {
            productId: '1',
            quantity: 1,
            price: 100,
            name: 'Test Product',
            image: 'test-image.jpg',
            specId: 'spec1',
            selectedVariants: { size: 'L', color: 'red' },
          },
        ],
        address: {
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '某某街道123号',
        },
        couponCode: 'SAVE10',
        remark: 'Test order',
      };

      const expectedResult = {
        id: 'order-1',
        orderNumber: 'ORD123456789',
        status: 'pending',
        items: [
          {
            productId: '1',
            name: '商品名称',
            image: '',
            quantity: 1,
            price: 100,
          },
        ],
        address: dto.address,
        payment: {
          method: '微信支付',
          amount: 100,
        },
        shipping: {
          method: '免费配送',
          fee: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(dto, mockUser);

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(dto, mockUser.id);
    });
  });

  describe('getOrders', () => {
    it('should get orders list', async () => {
      const expectedResult = {
        orders: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      mockOrderService.getOrders.mockResolvedValue(expectedResult);

      const result = await controller.getOrders(mockUser, '1', '10');

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.getOrders).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
        undefined,
      );
    });

    it('should get orders list with status filter', async () => {
      const expectedResult = {
        orders: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      mockOrderService.getOrders.mockResolvedValue(expectedResult);

      const result = await controller.getOrders(mockUser, '1', '10', 'pending');

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.getOrders).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
        'pending',
      );
    });
  });

  describe('getOrderById', () => {
    it('should get order by id', async () => {
      const orderId = 'order-1';
      const expectedResult = {
        id: orderId,
        orderNumber: 'ORD123456789',
        status: 'pending',
        items: [],
        address: {},
        payment: {},
        shipping: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrderService.getOrderById.mockResolvedValue(expectedResult);

      const result = await controller.getOrderById(orderId, mockUser);

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.getOrderById).toHaveBeenCalledWith(
        orderId,
        mockUser.id,
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      const orderId = 'order-1';
      const expectedResult = {
        id: orderId,
        status: 'CANCELLED',
        message: '订单已取消',
      };

      mockOrderService.cancelOrder.mockResolvedValue(expectedResult);

      const result = await controller.cancelOrder(orderId, mockUser);

      expect(result).toEqual(expectedResult);
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith(
        orderId,
        mockUser.id,
      );
    });
  });
});