import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { email, phone, password, ...userData } = createUserDto;

    // 检查邮箱或手机号是否已存在
    if (email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new ConflictException('邮箱已被注册');
      }
    }

    if (phone) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingUserByPhone) {
        throw new ConflictException('手机号已被注册');
      }
    }

    // 加密密码
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // 返回用户信息，不包含密码
    const { password: _, ...result } = user;
    return result;
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
