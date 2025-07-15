import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderCalculationItemDto {
  @ApiProperty({ description: '商品ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: '单价' })
  @IsNumber()
  price: number;
}

export class OrderCalculationRequestDto {
  @ApiProperty({ description: '商品列表', type: [OrderCalculationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderCalculationItemDto)
  items: OrderCalculationItemDto[];

  @ApiPropertyOptional({ description: '优惠券代码' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ description: '收货地址ID' })
  @IsOptional()
  @IsString()
  addressId?: string;
}

export class OrderCalculationResponseDto {
  @ApiProperty({ description: '商品小计' })
  subtotal: number;

  @ApiProperty({ description: '运费' })
  shipping: number;

  @ApiProperty({ description: '折扣金额' })
  discount: number;

  @ApiProperty({ description: '总金额' })
  total: number;

  @ApiPropertyOptional({ description: '优惠券折扣' })
  couponDiscount?: number;

  @ApiProperty({ description: '配送方式' })
  shippingMethod: string;
}