import {
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductQueryDto, ProductListResponseDto, ProductResponseDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('商品管理')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '获取商品列表', description: '分页获取商品列表，支持搜索、筛选和排序' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/ProductListResponseDto' },
        message: { type: 'string', example: '获取商品列表成功' }
      }
    }
  })
  @Public()
  @Get()
  async findAll(@Query(ValidationPipe) query: ProductQueryDto) {
    const result = await this.productService.findAll(query);
    return {
      success: true,
      data: result,
      message: '获取商品列表成功',
    };
  }

  @ApiOperation({ summary: '搜索商品', description: '根据关键词搜索商品' })
  @ApiQuery({ name: 'q', description: '搜索关键词', required: true, example: 'iPhone' })
  @ApiResponse({ 
    status: 200, 
    description: '搜索成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/ProductListResponseDto' },
        message: { type: 'string', example: '搜索商品成功' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '搜索关键词为空',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: { type: 'null' },
        message: { type: 'string', example: '搜索关键词不能为空' }
      }
    }
  })
  @Public()
  @Get('search')
  async search(
    @Query('q') searchTerm: string,
    @Query(ValidationPipe) query: ProductQueryDto,
  ) {
    if (!searchTerm) {
      return {
        success: false,
        data: null,
        message: '搜索关键词不能为空',
      };
    }

    const result = await this.productService.search(searchTerm, query);
    return {
      success: true,
      data: result,
      message: '搜索商品成功',
    };
  }

  @ApiOperation({ summary: '获取商品分类', description: '获取所有商品分类列表' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'array', items: { type: 'string' }, example: ['Electronics', 'Clothing', 'Books'] },
        message: { type: 'string', example: '获取商品分类成功' }
      }
    }
  })
  @Public()
  @Get('categories')
  async getCategories() {
    const categories = await this.productService.getCategories();
    return {
      success: true,
      data: categories,
      message: '获取商品分类成功',
    };
  }

  @ApiOperation({ summary: '按分类获取商品', description: '根据分类获取商品列表' })
  @ApiParam({ name: 'category', description: '商品分类', example: 'Electronics' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/ProductListResponseDto' },
        message: { type: 'string', example: '获取分类商品成功' }
      }
    }
  })
  @Public()
  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
    @Query(ValidationPipe) query: ProductQueryDto,
  ) {
    const result = await this.productService.findByCategory(category, query);
    return {
      success: true,
      data: result,
      message: '获取分类商品成功',
    };
  }

  @ApiOperation({ summary: '按商家获取商品', description: '根据商家ID获取商品列表' })
  @ApiParam({ name: 'merchantId', description: '商家ID', example: 'uuid-string' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/ProductListResponseDto' },
        message: { type: 'string', example: '获取商家商品成功' }
      }
    }
  })
  @Public()
  @Get('merchant/:merchantId')
  async findByMerchant(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query(ValidationPipe) query: ProductQueryDto,
  ) {
    const result = await this.productService.findByMerchant(merchantId, query);
    return {
      success: true,
      data: result,
      message: '获取商家商品成功',
    };
  }

  @ApiOperation({ summary: '获取商品详情', description: '根据商品ID获取商品详细信息' })
  @ApiParam({ name: 'id', description: '商品ID', example: 'uuid-string' })
  @ApiQuery({ name: 'includeSpecs', description: '是否包含规格信息', required: false, example: 'true' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/ProductResponseDto' },
        message: { type: 'string', example: '获取商品详情成功' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '商品不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: { type: 'null' },
        message: { type: 'string', example: '商品不存在' }
      }
    }
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeSpecs') includeSpecs?: string,
  ) {
    const shouldIncludeSpecs = includeSpecs === 'true';
    const product = await this.productService.findById(id, shouldIncludeSpecs);
    return {
      success: true,
      data: product,
      message: '获取商品详情成功',
    };
  }
}
