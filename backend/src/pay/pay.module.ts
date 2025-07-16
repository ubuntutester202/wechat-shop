import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { WxpayController } from './wxpay.controller';
import { WxpayService } from './wxpay.service';

@Module({
  imports: [ConfigModule],
  controllers: [PayController, WxpayController],
  providers: [PayService, WxpayService],
  exports: [PayService, WxpayService],
})
export class PayModule {}