import { Module } from '@nestjs/common';
import { UnityController } from './unity.controller';
import { UnityService } from './unity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from './entities/unity.entity';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity, CompanyEntity])],
  controllers: [UnityController],
  providers: [UnityService],
})
export class UnityModule {}
