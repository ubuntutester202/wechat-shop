import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: '订单ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: '支付金额（分）' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: '商品描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '用户openid', required: false })
  @IsOptional()
  @IsString()
  openid?: string;
}

export class PaymentCallbackDto {
  @ApiProperty({ description: '订单号' })
  @IsString()
  out_trade_no: string;

  @ApiProperty({ description: '微信支付订单号' })
  @IsString()
  transaction_id: string;

  @ApiProperty({ description: '支付状态' })
  @IsString()
  trade_state: string;

  @ApiProperty({ description: '支付金额（分）' })
  @IsNumber()
  total_fee: number;
}

export class WxPayResponseDto {
  @ApiProperty({ description: 'APP ID' })
  appId: string;

  @ApiProperty({ description: '时间戳' })
  timeStamp: string;

  @ApiProperty({ description: '随机字符串' })
  nonceStr: string;

  @ApiProperty({ description: '订单详情扩展字符串' })
  package: string;

  @ApiProperty({ description: '签名方式' })
  signType: string;

  @ApiProperty({ description: '签名' })
  paySign: string;

  @ApiProperty({ description: '预支付交易会话ID' })
  prepayId: string;
}