import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 验证必要字段
    if (!registerDto.email && !registerDto.phone && !registerDto.openId) {
      throw new BadRequestException('邮箱、手机号或微信OpenID至少需要提供一个');
    }

    if ((registerDto.email || registerDto.phone) && !registerDto.password) {
      throw new BadRequestException('使用邮箱或手机号注册时必须提供密码');
    }

    const user = await this.userService.create(registerDto);
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      success: true,
      data: {
        user: user,
        token: this.jwtService.sign(payload),
      },
      message: '用户注册成功',
    };
  }

  async login(loginDto: LoginDto) {
    let user: User | null = null;

    // 根据不同的登录方式查找用户
    if (loginDto.openId) {
      user = await this.userService.findByOpenId(loginDto.openId);
      if (!user) {
        throw new UnauthorizedException('微信用户不存在');
      }
    } else if (loginDto.email && loginDto.password) {
      user = await this.userService.findByEmail(loginDto.email);
      if (!user || !user.password) {
        throw new UnauthorizedException('邮箱或密码错误');
      }
      
      const isPasswordValid = await this.userService.validatePassword(
        loginDto.password,
        user.password,
      );
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('邮箱或密码错误');
      }
    } else if (loginDto.phone && loginDto.password) {
      user = await this.userService.findByPhone(loginDto.phone);
      if (!user || !user.password) {
        throw new UnauthorizedException('手机号或密码错误');
      }
      
      const isPasswordValid = await this.userService.validatePassword(
        loginDto.password,
        user.password,
      );
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('手机号或密码错误');
      }
    } else {
      throw new BadRequestException('请提供有效的登录凭据');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: this.jwtService.sign(payload),
      },
      message: '登录成功',
    };
  }

  async validateUser(id: string) {
    return this.userService.findById(id);
  }
}
