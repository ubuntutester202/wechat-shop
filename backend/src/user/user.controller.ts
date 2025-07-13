import { Controller, Get, Put, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const userProfile = await this.userService.findById(user.id);
    return {
      success: true,
      data: userProfile,
      message: '获取用户信息成功',
    };
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(user.id, updateUserDto);
    return {
      success: true,
      data: updatedUser,
      message: '更新用户信息成功',
    };
  }
}
