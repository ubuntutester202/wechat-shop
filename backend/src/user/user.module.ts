import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { AppLoggerService } from '../common/logger.service';

@Module({
  providers: [UserService, PrismaService, AppLoggerService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
