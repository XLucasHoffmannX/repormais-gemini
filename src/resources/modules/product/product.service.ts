import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { UnitEntity } from '../unity/entities/unity.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    try {
      const unit = await this.unitRepository.findOne({
        where: { id: dto.unitEntityId },
      });

      if (!unit) {
        throw new NotFoundException('Unidade não encontrada');
      }

      if (dto.barcode) {
        const existingProduct = await this.productRepository.findOne({
          where: { barcode: dto.barcode },
        });

        if (existingProduct) {
          throw new HttpException(
            'Já existe um produto com este código de barras!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const product = this.productRepository.create({
        ...dto,
        unitEntity: unit,
      });
      return this.productRepository.save(product);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /* paginate */
  async findByCompany(
    companyId: string,
    options: IPaginationOptions,
    search?: string,
    unitId?: string,
    barcode?: string,
  ) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.unitEntity', 'unit')
      .innerJoin('unit.company', 'company')
      .where('company.id = :companyId', { companyId });

    if (unitId) {
      queryBuilder.andWhere('unit.id = :unitId', { unitId });
    }

    if (search) {
      queryBuilder.andWhere('p.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (barcode) {
      queryBuilder.andWhere('TRIM(p.barcode) = TRIM(:barcode)', { barcode });
    }

    queryBuilder.orderBy('p.createdAt', 'DESC');

    return paginate<ProductEntity>(queryBuilder, options);
  }

  async findAll(companyId: string): Promise<ProductEntity[]> {
    return this.productRepository.find({
      where: { unitEntity: { company: { id: companyId } } },
      relations: ['unitEntity', 'unitEntity.company'],
    });
  }

  async findAllByUnit(
    companyId: string,
    unitId: string,
    search?: string,
  ): Promise<ProductEntity[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.unitEntity', 'unit')
      .innerJoinAndSelect('unit.company', 'company')
      .where('unit.id = :unitId', { unitId })
      .andWhere('company.id = :companyId', { companyId });

    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, companyId: string): Promise<ProductEntity> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException(`ID inválido: ${id}`);
      }

      const product = await this.productRepository.findOne({
        where: {
          id,
          unitEntity: { company: { id: companyId } },
        },
        relations: ['unitEntity', 'unitEntity.company'],
      });

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['unitEntity'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['unitEntity'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.productRepository.softRemove(product);
  }

  async findDeletedProducts(
    companyId: string,
    search?: string,
  ): Promise<ProductEntity[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .withDeleted()
      .innerJoinAndSelect('product.unitEntity', 'unit')
      .innerJoinAndSelect('unit.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere('product.deletedAt IS NOT NULL');

    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async restoreProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado na lixeira.');
    }

    await this.productRepository.restore(id);
  }
}
