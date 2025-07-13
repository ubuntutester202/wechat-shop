import {
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQueryDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
