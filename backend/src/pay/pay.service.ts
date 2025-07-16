import { Injectable, Logger } from '@nestjs/common';
import { WxpayService } from './wxpay.service';

export interface PaymentResult {
  success: boolean;
  paymentParams?: any;
  error?: string;
}

@Injectable()
export class PayService {
  private readonly logger = new Logger(PayService.name);

  constructor(private readonly wxpayService: WxpayService) {}

  /**
   * 统一支付接口
   */
  async createPayment(
    paymentType: 'wxpay' | 'alipay',
    paymentData: any,
  ): Promise<PaymentResult> {
    try {
      switch (paymentType) {
        case 'wxpay':
          const wxPayParams = await this.wxpayService.createPayment(paymentData);
          return {
            success: true,
            paymentParams: wxPayParams,
          };
        case 'alipay':
          // TODO: 实现支付宝支付
          throw new Error('支付宝支付暂未实现');
        default:
          throw new Error(`不支持的支付类型: ${paymentType}`);
      }
    } catch (error) {
      this.logger.error(`创建支付订单失败: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 处理支付回调
   */
  async handlePaymentCallback(
    paymentType: 'wxpay' | 'alipay',
    callbackData: any,
  ): Promise<boolean> {
    try {
      switch (paymentType) {
        case 'wxpay':
          return await this.wxpayService.verifyCallback(callbackData);
        case 'alipay':
          // TODO: 实现支付宝回调验证
          throw new Error('支付宝回调验证暂未实现');
        default:
          throw new Error(`不支持的支付类型: ${paymentType}`);
      }
    } catch (error) {
      this.logger.error(`处理支付回调失败: ${error.message}`);
      return false;
    }
  }
}