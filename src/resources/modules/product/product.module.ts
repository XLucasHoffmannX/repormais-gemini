import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UnitEntity } from '../unity/entities/unity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, UnitEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
