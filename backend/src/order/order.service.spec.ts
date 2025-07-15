import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma.service';
import { OrderCalculationRequestDto } from './dto';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateOrder', () => {
    it('should calculate order total correctly', async () => {
      const dto: OrderCalculationRequestDto = {
        items: [
          { productId: '1', quantity: 2, price: 50 },
          { productId: '2', quantity: 1, price: 30 },
        ],
      };

      const result = await service.calculateOrder(dto);

      expect(result.subtotal).toBe(130); // 2*50 + 1*30
      expect(result.shipping).toBe(0); // 满99免运费
      expect(result.discount).toBe(0); // 无优惠券
      expect(result.total).toBe(130);
      expect(result.shippingMethod).toBe('免费配送');
    });

    it('should add shipping fee for orders under 99', async () => {
      const dto: OrderCalculationRequestDto = {
        items: [{ productId: '1', quantity: 1, price: 50 }],
      };

      const result = await service.calculateOrder(dto);

      expect(result.subtotal).toBe(50);
      expect(result.shipping).toBe(10);
      expect(result.total).toBe(60);
      expect(result.shippingMethod).toBe('标准配送');
    });

    it('should apply coupon discount', async () => {
      const dto: OrderCalculationRequestDto = {
        items: [{ productId: '1', quantity: 1, price: 100 }],
        couponCode: 'SAVE10',
      };

      const result = await service.calculateOrder(dto);

      expect(result.subtotal).toBe(100);
      expect(result.shipping).toBe(0); // 满99免运费
      expect(result.couponDiscount).toBe(10);
      expect(result.discount).toBe(10);
      expect(result.total).toBe(90);
    });

    it('should not apply coupon if minimum amount not met', async () => {
      const dto: OrderCalculationRequestDto = {
        items: [{ productId: '1', quantity: 1, price: 30 }],
        couponCode: 'SAVE10', // 需要满50才能使用
      };

      const result = await service.calculateOrder(dto);

      expect(result.couponDiscount).toBe(0);
      expect(result.discount).toBe(0);
    });
  });

  describe('generateOrderNumber', () => {
    it('should generate order number with ORD prefix', () => {
      const orderNumber = service.generateOrderNumber();
      expect(orderNumber).toMatch(/^ORD\d{13}\d{3}$/);
    });

    it('should generate unique order numbers', () => {
      const orderNumber1 = service.generateOrderNumber();
      const orderNumber2 = service.generateOrderNumber();
      expect(orderNumber1).not.toBe(orderNumber2);
    });
  });

  describe('generateUUIDOrderNumber', () => {
    it('should generate UUID-based order number', () => {
      const orderNumber = service.generateUUIDOrderNumber();
      expect(orderNumber).toMatch(/^ORD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const dto = {
        items: [{ 
          productId: '1', 
          quantity: 1, 
          price: 100, 
          name: 'Test Product',
          image: 'test-image.jpg',
          specId: 'spec1',
          selectedVariants: {} 
        }],
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

      const mockOrder = {
        id: 'order-1',
        orderNumber: 'ORD123456789',
        userId: 'user-1',
        status: 'PENDING',
        totalAmount: 10000, // 100元转换为分
        discountAmount: 0,
        shippingAmount: 0,
        shippingAddress: JSON.stringify(dto.address),
        createdAt: new Date(),
        updatedAt: new Date(),
        paidAt: null,
        trackingNumber: null,
        items: [
          {
            productId: '1',
            quantity: 1,
            price: 10000,
            selectedVariants: '{}',
            name: null,
            image: null,
          },
        ],
      };

      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder(dto, 'user-1');

      expect(result.id).toBe('order-1');
      expect(result.status).toBe('pending');
      expect(result.payment.amount).toBe(100); // 转换回元
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      const mockOrder = {
        id: 'order-1',
        userId: 'user-1',
        status: 'PENDING',
      };

      const mockUpdatedOrder = {
        ...mockOrder,
        status: 'CANCELLED',
      };

      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await service.cancelOrder('order-1', 'user-1');

      expect(result.status).toBe('CANCELLED');
      expect(result.message).toBe('订单已取消');
    });

    it('should throw error if order not found or cannot be cancelled', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.cancelOrder('order-1', 'user-1')).rejects.toThrow(
        '订单不存在或无法取消',
      );
    });
  });
});