import { IsArray, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: '商品ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: '数量' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '单价（元）' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '商品名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '商品图片', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '规格ID', required: false })
  @IsOptional()
  @IsString()
  specId?: string;

  @ApiProperty({ description: '选择的规格', required: false })
  @IsOptional()
  selectedVariants?: Record<string, any>;
}

export class CreateOrderAddressDto {
  @ApiProperty({ description: '收货人姓名' })
  @IsString()
  name: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '省份' })
  @IsString()
  province: string;

  @ApiProperty({ description: '城市' })
  @IsString()
  city: string;

  @ApiProperty({ description: '区县' })
  @IsString()
  district: string;

  @ApiProperty({ description: '详细地址' })
  @IsString()
  detail: string;
}

export class CreateOrderRequestDto {
  @ApiProperty({ description: '订单商品列表', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ description: '收货地址', type: CreateOrderAddressDto })
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  address: CreateOrderAddressDto;

  @ApiPropertyOptional({ description: '优惠券代码' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}