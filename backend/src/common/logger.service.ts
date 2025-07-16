import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AppLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * 记录信息日志
   */
  info(message: string, context?: string, meta?: any) {
    this.logger.log(message, context, meta);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, context, meta);
  }

  /**
   * 记录错误日志
   */
  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, trace, context, meta);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, context, meta);
  }

  /**
   * 记录详细日志
   */
  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, context, meta);
  }

  /**
   * 记录用户操作日志
   */
  logUserAction(userId: string, action: string, details?: any) {
    this.info(`用户操作: ${action}`, 'UserAction', {
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 记录API请求日志
   */
  logApiRequest(method: string, url: string, userId?: string, duration?: number) {
    this.info(`API请求: ${method} ${url}`, 'ApiRequest', {
      method,
      url,
      userId,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 记录数据库操作日志
   */
  logDatabaseOperation(operation: string, table: string, details?: any) {
    this.debug(`数据库操作: ${operation} on ${table}`, 'Database', {
      operation,
      table,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 记录安全事件日志
   */
  logSecurityEvent(event: string, details?: any) {
    this.warn(`安全事件: ${event}`, 'Security', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}