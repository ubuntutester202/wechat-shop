import { SetMetadata } from '@nestjs/common';

/**
 * 角色枚举
 */
export enum Role {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
}

/**
 * 设置接口所需角色的装饰器
 * 使用方式：@Roles(Role.ADMIN, Role.MERCHANT)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);