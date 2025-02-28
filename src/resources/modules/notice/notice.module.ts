import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { ProductEntity } from '../product/entities/product.entity';
import { NoticeEntity } from './entities/notice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity, ProductEntity])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
