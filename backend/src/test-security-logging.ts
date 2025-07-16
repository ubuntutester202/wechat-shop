import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './common/logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function testSecurityAndLogging() {
  const app = await NestFactory.create(AppModule);
  
  // 获取日志服务
  const logger = app.get(AppLoggerService);
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  
  console.log('🔒 测试安全和日志功能...\n');
  
  // 测试基本日志功能
  console.log('📝 测试基本日志功能:');
  logger.info('这是一条信息日志', 'TestModule');
  logger.warn('这是一条警告日志', 'TestModule');
  logger.error('这是一条错误日志', null, 'TestModule');
  logger.debug('这是一条调试日志', 'TestModule');
  
  // 测试用户操作日志
  console.log('\n👤 测试用户操作日志:');
  logger.logUserAction('test-user-123', 'LOGIN_SUCCESS', { method: 'email' });
  logger.logUserAction('test-user-456', 'REGISTER', { method: 'wechat' });
  
  // 测试API请求日志
  console.log('\n🌐 测试API请求日志:');
  logger.logApiRequest('POST', '/api/auth/login', 'test-user-123', 150);
  logger.logApiRequest('GET', '/api/users/profile', 'test-user-456', 50);
  
  // 测试数据库操作日志
  console.log('\n💾 测试数据库操作日志:');
  logger.logDatabaseOperation('CREATE', 'users', { email: 'test@example.com' });
  logger.logDatabaseOperation('UPDATE', 'users', { lastLogin: new Date() });
  
  // 测试安全事件日志
  console.log('\n🛡️ 测试安全事件日志:');
  logger.logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
    email: 'test@example.com',
    ip: '192.168.1.100',
    userAgent: 'Test Browser'
  });
  logger.logSecurityEvent('RATE_LIMIT_EXCEEDED', { 
    ip: '192.168.1.200',
    endpoint: '/api/auth/login'
  });
  
  console.log('\n✅ 安全和日志功能测试完成!');
  console.log('📁 请检查 backend/logs/ 目录下的日志文件');
  console.log('   - combined.log: 所有日志');
  console.log('   - error.log: 错误日志');
  console.log('   - debug.log: 调试日志 (如果启用)');
  
  await app.close();
}

// 运行测试
testSecurityAndLogging().catch(console.error);