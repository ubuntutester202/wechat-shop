import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        nickname: 'testuser',
        role: 'BUYER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });
  });
});
