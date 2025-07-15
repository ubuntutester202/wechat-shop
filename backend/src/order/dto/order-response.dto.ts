import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ description: '商品ID' })
  productId: string;

  @ApiProperty({ description: '商品名称' })
  name: string;

  @ApiProperty({ description: '商品图片' })
  image: string;

  @ApiProperty({ description: '数量' })
  quantity: number;

  @ApiProperty({ description: '单价' })
  price: number;

  @ApiPropertyOptional({ description: '选中的规格' })
  selectedVariants?: Record<string, string>;
}

export class OrderAddressResponseDto {
  @ApiProperty({ description: '收货人姓名' })
  name: string;

  @ApiProperty({ description: '联系电话' })
  phone: string;

  @ApiProperty({ description: '省份' })
  province: string;

  @ApiProperty({ description: '城市' })
  city: string;

  @ApiProperty({ description: '区县' })
  district: string;

  @ApiProperty({ description: '详细地址' })
  detail: string;
}

export class OrderPaymentResponseDto {
  @ApiProperty({ description: '支付方式' })
  method: string;

  @ApiProperty({ description: '支付金额' })
  amount: number;

  @ApiPropertyOptional({ description: '支付时间' })
  paidAt?: Date;
}

export class OrderShippingResponseDto {
  @ApiProperty({ description: '配送方式' })
  method: string;

  @ApiProperty({ description: '运费' })
  fee: number;

  @ApiPropertyOptional({ description: '快递单号' })
  trackingNumber?: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: '订单ID' })
  id: string;

  @ApiProperty({ description: '订单号' })
  orderNumber: string;

  @ApiProperty({ description: '订单状态' })
  status: string;

  @ApiProperty({ description: '订单商品列表', type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: '收货地址', type: OrderAddressResponseDto })
  address: OrderAddressResponseDto;

  @ApiProperty({ description: '支付信息', type: OrderPaymentResponseDto })
  payment: OrderPaymentResponseDto;

  @ApiProperty({ description: '配送信息', type: OrderShippingResponseDto })
  shipping: OrderShippingResponseDto;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}