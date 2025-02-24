import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  createProductSchema,
} from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { AuthMiddleware } from 'src/resources/middlewares';
import { uuidSchema } from 'src/resources/shared/dto/uuid.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthMiddleware)
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() body: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(body);
  }

  /* paginado por empresa */
  @UseGuards(AuthMiddleware)
  @Get()
  findByCompany(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('unit') unitId?: string,
  ) {
    const companyId = req.auth.cId;

    return this.productService.findByCompany(
      companyId,
      { page, limit, route: `${req.protocol}://${req.get('host')}/products` },
      search,
      unitId,
    );
  }

  @UseGuards(AuthMiddleware)
  @Get('/all')
  async findAll(@Req() req): Promise<ProductEntity[]> {
    const companyId = req.auth.cId;

    return this.productService.findAll(companyId);
  }

  @UseGuards(AuthMiddleware)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', new ZodValidationPipe(uuidSchema)) id: string,
  ): Promise<ProductEntity> {
    const companyId = req.auth.cId;

    return this.productService.findOne(id, companyId);
  }

  @UseGuards(AuthMiddleware)
  @Patch(':id')
  @UsePipes()
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, body);
  }

  @UseGuards(AuthMiddleware)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
