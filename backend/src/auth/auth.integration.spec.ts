import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // 清理测试数据
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  });

  afterAll(async () => {
    // 清理所有测试数据
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
    await app.close();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    nickname: 'Test User',
  };

  describe('JWT Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should login with valid credentials', async () => {
      // 先注册用户
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
        
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should access protected route with valid token', async () => {
      // 先注册用户
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
        
      // First login to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data).toBeDefined();
      expect(loginResponse.body.data.token).toBeDefined();
      
      const token = loginResponse.body.data.token;

      // Access protected route
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should reject access to protected route without token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should allow access to public routes without token', async () => {
      await request(app.getHttpServer())
        .get('/')
        .expect(200);
    });
  });
});