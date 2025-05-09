import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { UnitEntity } from '../unity/entities/unity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CompanyEntity, UnitEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
