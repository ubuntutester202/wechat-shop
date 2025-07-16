import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { AppLoggerService } from '../common/logger.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: AppLoggerService,
  ) {}

  async create(createUserDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { email, phone, password, ...userData } = createUserDto;

    this.logger.info('开始创建用户', 'UserService', { email, phone });

    // 检查邮箱或手机号是否已存在
    if (email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        this.logger.warn('用户注册失败：邮箱已存在', 'UserService', { email });
        throw new ConflictException('邮箱已被注册');
      }
    }

    if (phone) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingUserByPhone) {
        this.logger.warn('用户注册失败：手机号已存在', 'UserService', { phone });
        throw new ConflictException('手机号已被注册');
      }
    }

    // 加密密码
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          email,
          phone,
          password: hashedPassword,
        },
      });

      this.logger.logDatabaseOperation('CREATE', 'user', { userId: user.id });
      this.logger.info('用户创建成功', 'UserService', { userId: user.id, email, phone });

      // 返回用户信息，不包含密码
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error('用户创建失败', error.stack, 'UserService', { email, phone, error: error.message });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findByOpenId(openId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { openId },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = user;
    return result;
  }
}
