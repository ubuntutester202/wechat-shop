import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AddCartItemDto,
  UpdateCartItemDto,
  BatchUpdateCartDto,
  CartResponseDto,
  CartItemResponseDto,
} from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartResponseDto> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            status: true,
          },
        },
        spec: {
          select: {
            id: true,
            name: true,
            value: true,
            priceAdjustment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data: CartItemResponseDto[] = cartItems.map((item) => {
      const images = item.product.images as string[] | null;
      const image = images && images.length > 0 ? images[0] : '';
      const actualPrice = item.product.price + (item.spec?.priceAdjustment || 0);

      return {
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: actualPrice,
        image,
        quantity: item.quantity,
        selectedVariants: item.spec
          ? { [item.spec.name]: item.spec.value }
          : undefined,
        spec: item.spec
          ? {
              id: item.spec.id,
              name: item.spec.name,
              value: item.spec.value,
              priceAdjustment: item.spec.priceAdjustment,
            }
          : undefined,
      };
    });

    const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = data.reduce((sum, item) => sum + item.quantity, 0);

    return {
      data,
      total,
      itemCount,
    };
  }

  async addItem(userId: string, addCartItemDto: AddCartItemDto) {
    const { productId, quantity, specId } = addCartItemDto;

    // 验证商品是否存在且可购买
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { specs: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== 'PUBLISHED') {
      throw new BadRequestException('Product is not available for purchase');
    }

    // 如果指定了规格，验证规格是否存在
    let spec = null;
    if (specId) {
      spec = await this.prisma.productSpec.findFirst({
        where: { id: specId, productId },
      });

      if (!spec) {
        throw new NotFoundException('Product specification not found');
      }
    }

    // 检查库存
    const availableStock = spec ? spec.stock : product.stock;
    if (availableStock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // 检查是否已存在相同的购物车项
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        specId: specId || null,
      },
    });

    if (existingCartItem) {
      // 更新数量
      const newQuantity = existingCartItem.quantity + quantity;
      if (availableStock < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const updatedItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
          spec: true,
        },
      });

      return this.formatCartItem(updatedItem);
    } else {
      // 创建新的购物车项
      const newCartItem = await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          specId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
          spec: true,
        },
      });

      return this.formatCartItem(newCartItem);
    }
  }

  async updateItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: {
        product: true,
        spec: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // 检查库存
    const availableStock = cartItem.spec ? cartItem.spec.stock : cartItem.product.stock;
    if (availableStock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return { success: true, message: 'Cart item updated successfully' };
  }

  async removeItem(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { success: true, message: 'Cart item removed successfully' };
  }

  async batchUpdate(userId: string, batchUpdateCartDto: BatchUpdateCartDto) {
    const { updates } = batchUpdateCartDto;

    // 验证所有购物车项都属于当前用户
    const cartItemIds = updates.map((update) => update.id);
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: {
        product: true,
        spec: true,
      },
    });

    if (cartItems.length !== updates.length) {
      throw new BadRequestException('Some cart items not found or do not belong to user');
    }

    // 验证库存并执行批量更新
    const updatePromises = updates.map(async (update) => {
      const cartItem = cartItems.find((item) => item.id === update.id);
      if (!cartItem) return;

      const availableStock = cartItem.spec ? cartItem.spec.stock : cartItem.product.stock;
      if (availableStock < update.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${cartItem.product.name}`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: update.id },
        data: { quantity: update.quantity },
      });
    });

    await Promise.all(updatePromises);

    return { success: true, message: 'Cart updated successfully' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { success: true, message: 'Cart cleared successfully' };
  }

  private formatCartItem(cartItem: any): CartItemResponseDto {
    const images = cartItem.product.images as string[] | null;
    const image = images && images.length > 0 ? images[0] : '';
    const actualPrice = cartItem.product.price + (cartItem.spec?.priceAdjustment || 0);

    return {
      id: cartItem.id,
      productId: cartItem.product.id,
      name: cartItem.product.name,
      price: actualPrice,
      image,
      quantity: cartItem.quantity,
      selectedVariants: cartItem.spec
        ? { [cartItem.spec.name]: cartItem.spec.value }
        : undefined,
      spec: cartItem.spec
        ? {
            id: cartItem.spec.id,
            name: cartItem.spec.name,
            value: cartItem.spec.value,
            priceAdjustment: cartItem.spec.priceAdjustment,
          }
        : undefined,
    };
  }
}