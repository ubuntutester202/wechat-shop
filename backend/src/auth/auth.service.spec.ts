import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole, UserStatus } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'user-id-123',
    openId: null,
    unionId: null,
    nickname: '测试用户',
    avatar: null,
    phone: null,
    email: 'test@example.com',
    password: 'hashed-password',
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: 'user-id-123',
    openId: null,
    unionId: null,
    nickname: '测试用户',
    avatar: null,
    phone: null,
    email: 'test@example.com',
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByOpenId: jest.fn(),
      findById: jest.fn(),
      validatePassword: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('应该成功注册用户（邮箱+密码）', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: '123456',
        nickname: '测试用户',
      };

      const mockToken = 'mock-jwt-token';
      userService.create.mockResolvedValue(mockUserWithoutPassword);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUserWithoutPassword.email,
        sub: mockUserWithoutPassword.id,
        role: mockUserWithoutPassword.role,
      });
      expect(result).toEqual({
        success: true,
        data: {
          user: mockUserWithoutPassword,
          token: mockToken,
        },
        message: '用户注册成功',
      });
    });

    it('应该成功注册用户（微信OpenID）', async () => {
      const registerDto: RegisterDto = {
        openId: 'wx-openid-123',
        nickname: '微信用户',
      };

      const mockWxUser = {
        ...mockUserWithoutPassword,
        openId: 'wx-openid-123',
        email: null,
      };
      const mockToken = 'mock-jwt-token';
      userService.create.mockResolvedValue(mockWxUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result.success).toBe(true);
      expect(result.data.user).toEqual(mockWxUser);
      expect(result.data.token).toBe(mockToken);
    });

    it('应该抛出异常：缺少必要字段', async () => {
      const registerDto: RegisterDto = {
        nickname: '测试用户',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        new BadRequestException('邮箱、手机号或微信OpenID至少需要提供一个'),
      );
    });

    it('应该抛出异常：邮箱注册时缺少密码', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        nickname: '测试用户',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        new BadRequestException('使用邮箱或手机号注册时必须提供密码'),
      );
    });

    it('应该抛出异常：手机号注册时缺少密码', async () => {
      const registerDto: RegisterDto = {
        phone: '13800138000',
        nickname: '测试用户',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        new BadRequestException('使用邮箱或手机号注册时必须提供密码'),
      );
    });
  });

  describe('login', () => {
    it('应该成功登录（邮箱+密码）', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '123456',
      };

      const mockToken = 'mock-jwt-token';
      userService.findByEmail.mockResolvedValue(mockUser);
      userService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(userService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        success: true,
        data: {
          user: mockUserWithoutPassword,
          token: mockToken,
        },
        message: '登录成功',
      });
    });

    it('应该成功登录（手机号+密码）', async () => {
      const loginDto: LoginDto = {
        phone: '13800138000',
        password: '123456',
      };

      const mockPhoneUser = {
        ...mockUser,
        phone: '13800138000',
        email: null,
      };
      const mockToken = 'mock-jwt-token';
      userService.findByPhone.mockResolvedValue(mockPhoneUser);
      userService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(userService.findByPhone).toHaveBeenCalledWith(loginDto.phone);
      expect(userService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockPhoneUser.password,
      );
      expect(result.success).toBe(true);
    });

    it('应该成功登录（微信OpenID）', async () => {
      const loginDto: LoginDto = {
        openId: 'wx-openid-123',
      };

      const mockWxUser = {
        ...mockUser,
        openId: 'wx-openid-123',
        email: null,
        password: null,
      };
      const mockToken = 'mock-jwt-token';
      userService.findByOpenId.mockResolvedValue(mockWxUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(userService.findByOpenId).toHaveBeenCalledWith(loginDto.openId);
      expect(result.success).toBe(true);
    });

    it('应该抛出异常：邮箱用户不存在', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: '123456',
      };

      userService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
    });

    it('应该抛出异常：邮箱密码错误', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      userService.findByEmail.mockResolvedValue(mockUser);
      userService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
    });

    it('应该抛出异常：手机号用户不存在', async () => {
      const loginDto: LoginDto = {
        phone: '13800138000',
        password: '123456',
      };

      userService.findByPhone.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('手机号或密码错误'),
      );
    });

    it('应该抛出异常：微信用户不存在', async () => {
      const loginDto: LoginDto = {
        openId: 'nonexistent-openid',
      };

      userService.findByOpenId.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('微信用户不存在'),
      );
    });

    it('应该抛出异常：无效的登录凭据', async () => {
      const loginDto: LoginDto = {};

      await expect(service.login(loginDto)).rejects.toThrow(
        new BadRequestException('请提供有效的登录凭据'),
      );
    });

    it('应该抛出异常：用户没有设置密码', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '123456',
      };

      const userWithoutPassword = {
        ...mockUser,
        password: null,
      };
      userService.findByEmail.mockResolvedValue(userWithoutPassword);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
    });
  });

  describe('validateUser', () => {
    it('应该成功验证用户', async () => {
      const userId = 'user-id-123';
      userService.findById.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.validateUser(userId);

      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('应该返回null当用户不存在', async () => {
      const userId = 'nonexistent-user-id';
      userService.findById.mockResolvedValue(null);

      const result = await service.validateUser(userId);

      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
});
