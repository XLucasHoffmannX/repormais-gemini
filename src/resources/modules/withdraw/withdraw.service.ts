import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WithdrawEntity, WithdrawType } from './entities/withdraw.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { UnitEntity } from '../unity/entities/unity.entity';
import { UserEntity } from '../user/entities/user.entity';
import { WithdrawDto } from './dto/create-withdraw.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(WithdrawEntity)
    private readonly withdrawRepository: Repository<WithdrawEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createWithdraw(data: WithdrawDto): Promise<WithdrawEntity> {
    const { productId, unitId, userId, quantity, type, reason } = data;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado!');

    const unit = await this.unitRepository.findOne({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('Unidade não encontrada!');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado!');

    // Verifica se há estoque suficiente antes da retirada
    if (type === WithdrawType.REMOVE && product.stockQuantity < quantity) {
      throw new BadRequestException('Estoque insuficiente para retirada!');
    }

    // Atualiza estoque do produto
    product.stockQuantity =
      type === WithdrawType.ENTRY
        ? product.stockQuantity + quantity
        : product.stockQuantity - quantity;

    await this.productRepository.save(product);

    // Registra a movimentação no banco de dados
    const withdraw = this.withdrawRepository.create({
      product,
      unit,
      user,
      quantity,
      type,
      reason,
    });

    return await this.withdrawRepository.save(withdraw);
  }

  async findAll(
    companyId: string,
    options: IPaginationOptions,
    filters: {
      type?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    },
  ) {
    const { type, startDate, endDate, search } = filters;

    const queryBuilder = this.withdrawRepository
      .createQueryBuilder('w')
      .withDeleted() // 🔥 Inclui registros soft-deleted
      .innerJoinAndSelect('w.product', 'product')
      .innerJoinAndSelect('w.unit', 'unit')
      .innerJoin('unit.company', 'company')
      .innerJoinAndSelect('w.user', 'user')
      .where('company.id = :companyId', { companyId });

    if (type) {
      queryBuilder.andWhere('w.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date();

      end.setHours(23, 59, 59, 999);

      queryBuilder.andWhere('w.createdAt BETWEEN :startDate AND :endDate', {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    }

    queryBuilder.orderBy('w.createdAt', 'DESC');

    return paginate<WithdrawEntity>(queryBuilder, options);
  }

  async findByProduct(
    productId: string,
    companyId: string,
  ): Promise<WithdrawEntity[]> {
    return this.withdrawRepository.find({
      where: {
        product: { id: productId },
        unit: { company: { id: companyId } },
      },
      relations: ['product', 'unit', 'user'],
    });
  }
}
