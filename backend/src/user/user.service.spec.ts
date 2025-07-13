import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

// Mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// Mock 用户数据
const mockUser = {
  id: 'user-id-123',
  email: 'test@example.com',
  phone: '13800138000',
  openId: 'wx-openid-123',
  unionId: 'wx-unionid-123',
  password: 'hashedPassword123',
  nickname: '测试用户',
  avatar: null,
  role: 'BUYER' as const,
  status: 'ACTIVE' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserWithoutPassword = {
  id: 'user-id-123',
  email: 'test@example.com',
  phone: '13800138000',
  openId: 'wx-openid-123',
  unionId: 'wx-unionid-123',
  nickname: '测试用户',
  avatar: null,
  role: 'BUYER' as const,
  status: 'ACTIVE' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建用户（邮箱+密码）', async () => {
      const createUserDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: '测试用户',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('应该成功创建用户（手机号+密码）', async () => {
      const createUserDto: RegisterDto = {
        phone: '13800138000',
        password: 'password123',
        nickname: '测试用户',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.phone).toBe('13800138000');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('应该成功创建用户（微信OpenID）', async () => {
      const createUserDto: RegisterDto = {
        openId: 'wx-openid-123',
        nickname: '测试用户',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.openId).toBe('wx-openid-123');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('应该抛出异常：邮箱已存在', async () => {
      const createUserDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('邮箱已被注册'),
      );
    });

    it('应该抛出异常：手机号已存在', async () => {
      const createUserDto: RegisterDto = {
        phone: '13800138000',
        password: 'password123',
      };

      // 第一次调用检查email（没有email所以不会调用）
      // 第二次调用检查phone
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('手机号已被注册'),
      );
    });
  });

  describe('findByEmail', () => {
    it('应该成功通过邮箱查找用户', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('应该返回null当用户不存在', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByPhone', () => {
    it('应该成功通过手机号查找用户', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByPhone('13800138000');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { phone: '13800138000' },
      });
    });

    it('应该返回null当用户不存在', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByPhone('13800138001');

      expect(result).toBeNull();
    });
  });

  describe('findByOpenId', () => {
    it('应该成功通过微信OpenID查找用户', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByOpenId('wx-openid-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { openId: 'wx-openid-123' },
      });
    });

    it('应该返回null当用户不存在', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByOpenId('wx-nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('应该成功通过ID查找用户', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user-id-123');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-123' },
      });
    });

    it('应该返回null当用户不存在', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('应该返回true当密码正确', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('应该返回false当密码错误', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('应该成功更新用户信息', async () => {
      const userId = 'user-id-123';
      const updateData = {
        nickname: '新昵称',
        avatar: 'new-avatar.jpg',
      };
      const updatedUser = { ...mockUser, ...updateData };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(result).not.toHaveProperty('password');
      expect(result.nickname).toBe('新昵称');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });
  });
});
