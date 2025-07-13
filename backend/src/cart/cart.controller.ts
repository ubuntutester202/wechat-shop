import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import {
  AddCartItemDto,
  UpdateCartItemDto,
  BatchUpdateCartDto,
  CartResponseDto,
  CartItemResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the shopping cart' })
  @ApiResponse({
    status: 200,
    description: 'The shopping cart contents',
    type: CartResponseDto,
  })
  async getCart(@CurrentUser('id') userId: string): Promise<CartResponseDto> {
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({
    status: 200,
    description: 'Item added successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { $ref: '#/components/schemas/CartItemResponseDto' },
        message: { type: 'string' },
      },
    },
  })
  async addItem(
    @CurrentUser('id') userId: string,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    const data = await this.cartService.addItem(userId, addCartItemDto);
    return {
      success: true,
      data,
      message: 'Item added to cart successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item from the cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item deleted',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Patch('batch')
  @ApiOperation({ summary: 'Batch update cart items' })
  @ApiResponse({
    status: 200,
    description: 'Cart batch updated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async batchUpdate(
    @CurrentUser('id') userId: string,
    @Body() batchUpdateCartDto: BatchUpdateCartDto,
  ) {
    return this.cartService.batchUpdate(userId, batchUpdateCartDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the shopping cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}