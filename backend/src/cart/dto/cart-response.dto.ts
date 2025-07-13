import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'clp1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'clp1234567891',
  })
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 999900,
  })
  price: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Quantity in cart',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Selected variants',
    example: { color: 'Space Black', storage: '256GB' },
    required: false,
  })
  selectedVariants?: Record<string, any>;

  @ApiProperty({
    description: 'Product specification details',
    required: false,
  })
  spec?: {
    id: string;
    name: string;
    value: string;
    priceAdjustment: number;
  };
}

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart items',
    type: [CartItemResponseDto],
  })
  data: CartItemResponseDto[];

  @ApiProperty({
    description: 'Total amount in cents',
    example: 1999800,
  })
  total: number;

  @ApiProperty({
    description: 'Total item count',
    example: 2,
  })
  itemCount: number;
}