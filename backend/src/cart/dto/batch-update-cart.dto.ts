import { IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CartItemUpdate {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'clp1234567890',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'New quantity',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class BatchUpdateCartDto {
  @ApiProperty({
    description: 'Array of cart item updates',
    type: [CartItemUpdate],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemUpdate)
  updates: CartItemUpdate[];
}