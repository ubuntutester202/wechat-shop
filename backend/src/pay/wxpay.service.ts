import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto, WxPayResponseDto } from './dto/wxpay.dto';

@Injectable()
export class WxpayService {
  private readonly logger = new Logger(WxpayService.name);
  private readonly isMockMode: boolean;

  constructor(private configService: ConfigService) {
    this.isMockMode = this.configService.get('WECHAT_PAY_MODE') === 'mock';
  }

  /**
   * 创建支付订单
   */
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<WxPayResponseDto> {
    if (this.isMockMode) {
      return this.createMockPayment(createPaymentDto);
    } else {
      return this.createRealPayment(createPaymentDto);
    }
  }

  /**
   * 模拟支付参数生成
   */
  private createMockPayment(createPaymentDto: CreatePaymentDto): WxPayResponseDto {
    const timeStamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = this.generateNonceStr();
    const prepayId = `wx${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    this.logger.log(`创建模拟支付订单: ${createPaymentDto.orderId}, 金额: ${createPaymentDto.amount}分`);

    return {
      appId: this.configService.get('WECHAT_PAY_APP_ID') || 'mock_app_id',
      timeStamp,
      nonceStr,
      package: `prepay_id=${prepayId}`,
      signType: 'RSA',
      paySign: this.generateMockSignature(timeStamp, nonceStr, prepayId),
      prepayId,
    };
  }

  /**
   * 真实支付参数生成（预留）
   */
  private async createRealPayment(createPaymentDto: CreatePaymentDto): Promise<WxPayResponseDto> {
    // TODO: 实现真实的微信支付接口调用
    // 这里需要使用 @wechat-pay/node SDK
    this.logger.log('真实支付模式暂未实现');
    throw new Error('真实支付模式暂未实现');
  }

  /**
   * 验证支付回调
   */
  async verifyCallback(callbackData: any): Promise<boolean> {
    if (this.isMockMode) {
      return this.verifyMockCallback(callbackData);
    } else {
      return this.verifyRealCallback(callbackData);
    }
  }

  /**
   * 模拟回调验证
   */
  private verifyMockCallback(callbackData: any): boolean {
    this.logger.log('模拟支付回调验证通过');
    return true;
  }

  /**
   * 真实回调验证（预留）
   */
  private verifyRealCallback(callbackData: any): boolean {
    // TODO: 实现真实的签名验证
    this.logger.log('真实支付回调验证暂未实现');
    return false;
  }

  /**
   * 生成随机字符串
   */
  private generateNonceStr(): string {
    return Math.random().toString(36).substr(2, 15);
  }

  /**
   * 生成模拟签名
   */
  private generateMockSignature(timeStamp: string, nonceStr: string, prepayId: string): string {
    // 模拟签名生成
    const signData = `${timeStamp}${nonceStr}${prepayId}mock_signature`;
    return Buffer.from(signData).toString('base64').substr(0, 32);
  }

  /**
   * 手动触发支付成功回调（用于测试）
   */
  async triggerMockCallback(orderId: string) {
    if (!this.isMockMode) {
      throw new Error('只有在模拟模式下才能手动触发回调');
    }

    const mockCallbackData = {
      out_trade_no: orderId,
      transaction_id: `wx_mock_${Date.now()}`,
      trade_state: 'SUCCESS',
      total_fee: 100, // 模拟金额
      time_end: new Date().toISOString(),
    };

    this.logger.log(`手动触发模拟支付回调: ${orderId}`);
    return mockCallbackData;
  }
}