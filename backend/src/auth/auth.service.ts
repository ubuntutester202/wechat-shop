import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { AppLoggerService } from '../common/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: AppLoggerService,
  ) {}

  async register(registerDto: RegisterDto) {
    this.logger.info('用户注册请求', 'AuthService', { 
      email: registerDto.email, 
      phone: registerDto.phone,
      hasOpenId: !!registerDto.openId 
    });

    // 验证必要字段
    if (!registerDto.email && !registerDto.phone && !registerDto.openId) {
      this.logger.warn('注册失败：缺少必要字段', 'AuthService', registerDto);
      throw new BadRequestException('邮箱、手机号或微信OpenID至少需要提供一个');
    }

    if ((registerDto.email || registerDto.phone) && !registerDto.password) {
      this.logger.warn('注册失败：缺少密码', 'AuthService', { 
        email: registerDto.email, 
        phone: registerDto.phone 
      });
      throw new BadRequestException('使用邮箱或手机号注册时必须提供密码');
    }

    try {
      const user = await this.userService.create(registerDto);
      const payload = { email: user.email, sub: user.id, role: user.role };
      
      this.logger.logUserAction(user.id, 'REGISTER', { 
        method: registerDto.openId ? 'wechat' : 'email_phone' 
      });
      
      return {
        success: true,
        data: {
          user: user,
          token: this.jwtService.sign(payload),
        },
        message: '用户注册成功',
      };
    } catch (error) {
      this.logger.error('用户注册失败', error.stack, 'AuthService', { 
        email: registerDto.email, 
        phone: registerDto.phone,
        error: error.message 
      });
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    this.logger.info('用户登录请求', 'AuthService', { 
      email: loginDto.email, 
      phone: loginDto.phone,
      hasOpenId: !!loginDto.openId 
    });

    let user: User | null = null;

    try {
      // 根据不同的登录方式查找用户
      if (loginDto.openId) {
        user = await this.userService.findByOpenId(loginDto.openId);
        if (!user) {
          this.logger.logSecurityEvent('LOGIN_FAILED_WECHAT_USER_NOT_FOUND', { 
            openId: loginDto.openId 
          });
          throw new UnauthorizedException('微信用户不存在');
        }
      } else if (loginDto.email && loginDto.password) {
        user = await this.userService.findByEmail(loginDto.email);
        if (!user || !user.password) {
          this.logger.logSecurityEvent('LOGIN_FAILED_EMAIL_NOT_FOUND', { 
            email: loginDto.email 
          });
          throw new UnauthorizedException('邮箱或密码错误');
        }
        
        const isPasswordValid = await this.userService.validatePassword(
          loginDto.password,
          user.password,
        );
        
        if (!isPasswordValid) {
          this.logger.logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
            email: loginDto.email,
            userId: user.id 
          });
          throw new UnauthorizedException('邮箱或密码错误');
        }
      } else if (loginDto.phone && loginDto.password) {
        user = await this.userService.findByPhone(loginDto.phone);
        if (!user || !user.password) {
          this.logger.logSecurityEvent('LOGIN_FAILED_PHONE_NOT_FOUND', { 
            phone: loginDto.phone 
          });
          throw new UnauthorizedException('手机号或密码错误');
        }
        
        const isPasswordValid = await this.userService.validatePassword(
          loginDto.password,
          user.password,
        );
        
        if (!isPasswordValid) {
          this.logger.logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
            phone: loginDto.phone,
            userId: user.id 
          });
          throw new UnauthorizedException('手机号或密码错误');
        }
      } else {
        this.logger.warn('登录失败：无效的登录凭据', 'AuthService', loginDto);
        throw new BadRequestException('请提供有效的登录凭据');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const { password, ...userWithoutPassword } = user;
      
      this.logger.logUserAction(user.id, 'LOGIN_SUCCESS', { 
        method: loginDto.openId ? 'wechat' : (loginDto.email ? 'email' : 'phone') 
      });
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: this.jwtService.sign(payload),
        },
        message: '登录成功',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('登录过程中发生错误', error.stack, 'AuthService', { 
        email: loginDto.email, 
        phone: loginDto.phone,
        error: error.message 
      });
      throw error;
    }
  }

  async validateUser(id: string) {
    return this.userService.findById(id);
  }
}
