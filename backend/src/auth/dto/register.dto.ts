import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({ description: '微信OpenID', example: 'wx_openid_123' })
  @IsOptional()
  @IsString()
  openId?: string;

  @ApiPropertyOptional({ description: '微信UnionID', example: 'wx_unionid_123' })
  @IsOptional()
  @IsString()
  unionId?: string;

  @ApiPropertyOptional({ description: '用户昵称', example: '张三' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱地址', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '密码（最少6位）', example: 'password123', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}