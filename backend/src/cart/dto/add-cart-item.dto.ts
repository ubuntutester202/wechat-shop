import { IsString, IsInt, Min, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'clp1234567890',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Selected product specification ID',
    example: 'clp1234567891',
    required: false,
  })
  @IsOptional()
  @IsString()
  specId?: string;

  @ApiProperty({
    description: 'Selected variants (for compatibility with frontend)',
    example: { color: 'red', size: 'L' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  selectedVariants?: Record<string, any>;
}