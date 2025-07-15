import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  OrderCalculationRequestDto,
  OrderCalculationResponseDto,
  CreateOrderRequestDto,
  OrderResponseDto,
} from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  /**
   * 计算订单金额
   * 包括商品小计、运费、优惠券折扣等
   */
  async calculateOrder(
    dto: OrderCalculationRequestDto,
  ): Promise<OrderCalculationResponseDto> {
    // 计算商品小计
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 计算运费（简单逻辑：满99免运费，否则10元）
    const shipping = subtotal >= 99 ? 0 : 10;

    // 计算优惠券折扣
    let couponDiscount = 0;
    if (dto.couponCode) {
      couponDiscount = await this.calculateCouponDiscount(
        dto.couponCode,
        subtotal,
      );
    }

    // 计算总折扣
    const discount = couponDiscount;

    // 计算总金额
    const total = subtotal + shipping - discount;

    return {
      subtotal,
      shipping,
      discount,
      total: Math.max(0, total), // 确保总金额不为负
      couponDiscount,
      shippingMethod: shipping === 0 ? '免费配送' : '标准配送',
    };
  }

  /**
   * 计算优惠券折扣
   */
  private async calculateCouponDiscount(
    couponCode: string,
    subtotal: number,
  ): Promise<number> {
    // 这里可以根据实际业务逻辑查询数据库中的优惠券信息
    // 目前使用简单的模拟逻辑
    const couponMap: Record<string, { type: 'fixed' | 'percent'; value: number; minAmount?: number }> = {
      'SAVE10': { type: 'fixed', value: 10, minAmount: 50 },
      'SAVE20': { type: 'fixed', value: 20, minAmount: 100 },
      'PERCENT10': { type: 'percent', value: 0.1, minAmount: 80 },
    };

    const coupon = couponMap[couponCode];
    if (!coupon) {
      return 0;
    }

    // 检查最低消费金额
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return 0;
    }

    // 计算折扣金额
    if (coupon.type === 'fixed') {
      return Math.min(coupon.value, subtotal);
    } else {
      return subtotal * coupon.value;
    }
  }

  /**
   * 生成订单号
   * 使用时间戳 + 随机数的方式生成唯一订单号
   */
  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  /**
   * 生成UUID订单号（备选方案）
   */
  generateUUIDOrderNumber(): string {
    return `ORD-${uuidv4()}`;
  }

  /**
   * 创建订单
   */
  async createOrder(
    dto: CreateOrderRequestDto,
    userId: string,
  ): Promise<OrderResponseDto> {
    // 生成订单号
    const orderNumber = this.generateOrderNumber();

    // 计算订单金额
    const calculation = await this.calculateOrder({
      items: dto.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      couponCode: dto.couponCode,
    });

    // 创建订单
    const order = await this.prisma.order.create({
      data: {
        orderNo: orderNumber,
        buyer: { connect: { id: userId } },
        merchant: { connect: { id: 'default-merchant' } }, // TODO: 从商品信息中获取
        status: 'PENDING',
        totalAmount: Math.round(calculation.total * 100), // 转换为分
        discountAmount: Math.round((calculation.couponDiscount || 0) * 100),
        shippingAmount: Math.round(calculation.shipping * 100),
        paymentAmount: Math.round(calculation.total * 100),
        shippingAddress: JSON.stringify(dto.address),
        remark: dto.remark,
        items: {
          create: dto.items.map(item => ({
            product: { connect: { id: item.productId } },
            spec: item.specId ? { connect: { id: item.specId } } : undefined,
            quantity: item.quantity,
            unitPrice: Math.round(item.price * 100), // 转换为分
            totalPrice: Math.round(item.price * item.quantity * 100), // 转换为分
            productSnapshot: JSON.stringify({
              name: item.name || 'Product',
              price: item.price,
              image: item.image || '',
            }),
            specSnapshot: item.selectedVariants ? JSON.stringify(item.selectedVariants) : null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 格式化返回数据
    return this.formatOrderResponse(order);
  }

  /**
   * 获取订单详情
   */
  async getOrderById(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    return this.formatOrderResponse(order);
  }

  /**
   * 获取订单列表
   */
  async getOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    
    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => this.formatOrderResponse(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 取消订单
   */
  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
        status: 'PENDING', // 只有待支付的订单可以取消
      },
    });

    if (!order) {
      throw new Error('订单不存在或无法取消');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return {
      id: updatedOrder.id,
      status: updatedOrder.status,
      message: '订单已取消',
    };
  }

  /**
   * 格式化订单响应数据
   */
  private formatOrderResponse(order: any): OrderResponseDto {
    const shippingAddress = JSON.parse(order.shippingAddress || '{}');
    
    return {
      id: order.id,
      orderNumber: order.orderNo,
      status: order.status.toLowerCase(),
      items: order.items.map((item: any) => ({
        productId: item.productId,
        name: item.name || '商品名称', // 这里应该从商品表获取
        image: item.image || '', // 这里应该从商品表获取
        quantity: item.quantity,
        price: item.price / 100, // 转换为元
        selectedVariants: item.selectedVariants ? JSON.parse(item.selectedVariants) : undefined,
      })),
      address: shippingAddress,
      payment: {
        method: '微信支付',
        amount: order.totalAmount / 100, // 转换为元
        paidAt: order.paidAt,
      },
      shipping: {
        method: order.shippingAmount === 0 ? '免费配送' : '标准配送',
        fee: order.shippingAmount / 100, // 转换为元
        trackingNumber: order.trackingNumber,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}