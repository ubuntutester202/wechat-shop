import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import {
  OrderCalculationRequestDto,
  OrderCalculationResponseDto,
  CreateOrderRequestDto,
  OrderResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate order total' })
  @ApiResponse({
    status: 200,
    description: 'Calculation result',
    type: OrderCalculationResponseDto,
  })
  async calculateOrder(
    @Body() dto: OrderCalculationRequestDto,
  ): Promise<OrderCalculationResponseDto> {
    return this.orderService.calculateOrder(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created',
    type: OrderResponseDto,
  })
  async createOrder(
    @Body() dto: CreateOrderRequestDto,
    @CurrentUser() user: any,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of orders' })
  @ApiResponse({
    status: 200,
    description: 'A list of orders',
  })
  async getOrders(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    return this.orderService.getOrders(
      user.id,
      parseInt(page),
      parseInt(limit),
      status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getOrderById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderById(id, user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled',
  })
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.orderService.cancelOrder(id, user.id);
  }
}