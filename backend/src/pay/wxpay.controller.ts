import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WxpayService } from './wxpay.service';
import { CreatePaymentDto, WxPayResponseDto, PaymentCallbackDto } from './dto/wxpay.dto';

@ApiTags('微信支付')
@Controller('pay/wxpay')
export class WxpayController {
  private readonly logger = new Logger(WxpayController.name);

  constructor(private readonly wxpayService: WxpayService) {}

  @Post('create')
  @ApiOperation({ summary: '创建微信支付订单' })
  @ApiResponse({
    status: 200,
    description: '支付参数',
    type: WxPayResponseDto,
  })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<WxPayResponseDto> {
    this.logger.log(`创建支付订单请求: ${JSON.stringify(createPaymentDto)}`);
    
    const paymentParams = await this.wxpayService.createPayment(createPaymentDto);
    
    this.logger.log(`支付参数生成成功: ${createPaymentDto.orderId}`);
    return paymentParams;
  }

  @Post('notify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '微信支付回调通知' })
  @ApiResponse({
    status: 200,
    description: '回调处理成功',
  })
  async paymentNotify(@Body() callbackData: any): Promise<{ code: string; message: string }> {
    this.logger.log(`收到支付回调: ${JSON.stringify(callbackData)}`);

    try {
      const isValid = await this.wxpayService.verifyCallback(callbackData);
      
      if (isValid) {
        // TODO: 更新订单状态为已支付
        this.logger.log(`支付回调验证成功: ${callbackData.out_trade_no}`);
        
        return {
          code: 'SUCCESS',
          message: '处理成功',
        };
      } else {
        this.logger.error(`支付回调验证失败: ${callbackData.out_trade_no}`);
        return {
          code: 'FAIL',
          message: '验证失败',
        };
      }
    } catch (error) {
      this.logger.error(`支付回调处理异常: ${error.message}`);
      return {
        code: 'FAIL',
        message: '处理异常',
      };
    }
  }

  @Post('mock-callback/:orderId')
  @ApiOperation({ summary: '手动触发模拟支付回调（仅测试用）' })
  @ApiResponse({
    status: 200,
    description: '模拟回调触发成功',
  })
  async triggerMockCallback(@Param('orderId') orderId: string) {
    this.logger.log(`手动触发模拟回调: ${orderId}`);
    
    const mockCallbackData = await this.wxpayService.triggerMockCallback(orderId);
    
    // 自动调用回调处理逻辑
    await this.paymentNotify(mockCallbackData);
    
    return {
      success: true,
      message: '模拟支付回调触发成功',
      data: mockCallbackData,
    };
  }

  @Get('status/:orderId')
  @ApiOperation({ summary: '查询支付状态' })
  @ApiResponse({
    status: 200,
    description: '支付状态查询结果',
  })
  async getPaymentStatus(@Param('orderId') orderId: string) {
    this.logger.log(`查询支付状态: ${orderId}`);
    
    // TODO: 实现支付状态查询逻辑
    return {
      orderId,
      status: 'pending', // pending, paid, failed, cancelled
      message: '支付状态查询功能待实现',
    };
  }
}