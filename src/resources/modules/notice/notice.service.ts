import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeEntity, NoticeType } from './entities/notice.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async generateNotices(companyId: string) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30); // Produtos que vencem nos próximos 30 dias

    const productsWithIssues = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.unitEntity', 'unit')
      .innerJoin('unit.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere(
        '(product.expirationDate <= :futureDate OR product.stockQuantity <= product.minimumStock)',
        { futureDate },
      )
      .getMany();

    for (const product of productsWithIssues) {
      const messageStock = `Produto "${product.name}" está com ${product.stockQuantity} unidades, abaixo do mínimo de ${product.minimumStock}.`;
      const messageExpirationDate = `Produto "${product.name}" prestes a vencer.`;

      const existingNotice = await this.noticeRepository.findOne({
        where: { product: { id: product.id }, resolved: false },
      });

      if (!existingNotice) {
        const notice = this.noticeRepository.create({
          product,
          message:
            new Date(product.expirationDate) <= futureDate
              ? messageExpirationDate
              : messageStock,
          type:
            product.expirationDate && product.expirationDate < futureDate
              ? NoticeType.EXPIRATION_WARNING
              : NoticeType.STOCK_WARNING,
          resolved: false,
        });

        await this.noticeRepository.save(notice);
      }
    }
  }

  async getNotices(companyId: string) {
    await this.generateNotices(companyId);

    return this.noticeRepository
      .createQueryBuilder('notice')
      .innerJoinAndSelect('notice.product', 'product')
      .innerJoin('product.unitEntity', 'unit')
      .innerJoin('unit.company', 'company')
      .where('notice.resolved = :resolved', { resolved: false })
      .andWhere('company.id = :companyId', { companyId })
      .orderBy('notice.createdAt', 'DESC')
      .getMany();
  }

  async resolveNotice(id: string) {
    await this.noticeRepository.update(id, { resolved: true });
  }

  async resolveAllNotices() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    await this.noticeRepository
      .createQueryBuilder()
      .delete()
      .from(NoticeEntity)
      .where('created_at <= :thirtyDaysAgo', { thirtyDaysAgo })
      .execute();

    await this.noticeRepository.update({ resolved: false }, { resolved: true });
  }
}
