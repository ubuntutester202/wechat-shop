import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';
import * as path from 'path';

const { combine, timestamp, errors, json, printf, colorize } = format;

// 自定义日志格式
const customFormat = printf(({ level, message, timestamp, stack, context, ...meta }) => {
  let log = `${timestamp} [${level}]`;
  
  if (context) {
    log += ` [${context}]`;
  }
  
  log += ` ${message}`;
  
  if (stack) {
    log += `\n${stack}`;
  }
  
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// 控制台格式（带颜色）
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  customFormat
);

// 文件格式（JSON）
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

export const loggerConfig: WinstonModuleOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'online-sales-backend' },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    }),
    
    // 错误日志文件
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // 组合日志文件
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  
  // 异常处理
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      format: fileFormat,
    }),
  ],
  
  // 拒绝处理（未捕获的 Promise 拒绝）
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      format: fileFormat,
    }),
  ],
};

// 生产环境日志分级配置
export const productionLoggerConfig: WinstonModuleOptions = {
  ...loggerConfig,
  level: 'error', // 生产环境只记录错误级别及以上
  transports: [
    // 生产环境控制台只输出错误
    new winston.transports.Console({
      format: consoleFormat,
      level: 'error',
    }),
    
    // 错误日志
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
    
    // 信息日志（包含 info 和 warn）
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'info.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
    
    // 调试日志（开发时可启用）
    ...(process.env.ENABLE_DEBUG_LOG === 'true' ? [
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'debug.log'),
        level: 'debug',
        format: fileFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
    ] : []),
  ],
};