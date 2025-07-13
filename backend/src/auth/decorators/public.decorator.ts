import { SetMetadata } from '@nestjs/common';

/**
 * 标记接口为公开访问，不需要JWT认证
 * 使用方式：@Public()
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);