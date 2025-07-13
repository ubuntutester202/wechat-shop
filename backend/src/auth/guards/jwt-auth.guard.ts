import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT认证守卫 - 支持公共接口跳过认证
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    // 排除 Swagger 文档路径
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    if (url.startsWith('/api') || url.startsWith('/api-json') || url.startsWith('/api-yaml')) {
      return true;
    }
    
    return super.canActivate(context);
  }
}