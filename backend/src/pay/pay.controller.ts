import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PayService } from './pay.service';

@ApiTags('支付管理')
@Controller('pay')
export class PayController {
  private readonly logger = new Logger(PayController.name);

  constructor(private readonly payService: PayService) {}

  @Get('methods')
  @ApiOperation({ summary: '获取支持的支付方式' })
  @ApiResponse({
    status: 200,
    description: '支付方式列表',
  })
  async getPaymentMethods() {
    return {
      methods: [
        {
          type: 'wxpay',
          name: '微信支付',
          enabled: true,
          description: '支持微信H5支付',
        },
        {
          type: 'alipay',
          name: '支付宝',
          enabled: false,
          description: '支付宝支付（待实现）',
        },
      ],
    };
  }

  @Post('create')
  @ApiOperation({ summary: '创建支付订单（通用接口）' })
  @ApiResponse({
    status: 200,
    description: '支付订单创建结果',
  })
  async createPayment(@Body() paymentData: {
    type: 'wxpay' | 'alipay';
    orderId: string;
    amount: number;
    description: string;
    openid?: string;
  }) {
    this.logger.log(`创建支付订单: ${JSON.stringify(paymentData)}`);
    
    const result = await this.payService.createPayment(paymentData.type, {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      description: paymentData.description,
      openid: paymentData.openid,
    });

    return result;
  }

  @Get('config')
  @ApiOperation({ summary: '获取支付配置信息' })
  @ApiResponse({
    status: 200,
    description: '支付配置信息',
  })
  async getPaymentConfig() {
    return {
      mode: process.env.WECHAT_PAY_MODE || 'mock',
      supportedMethods: ['wxpay'],
      currency: 'CNY',
      minAmount: 1, // 最小支付金额（分）
      maxAmount: 100000, // 最大支付金额（分）
    };
  }
}