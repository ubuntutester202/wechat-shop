import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }
}
