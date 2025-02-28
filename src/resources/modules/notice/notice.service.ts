import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
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

  async generateNotices() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30); // Produtos que vencem nos próximos 30 dias

    const productsWithIssues = await this.productRepository.find({
      where: [
        { expirationDate: LessThanOrEqual(futureDate) }, // Validade próxima
        { stockQuantity: LessThanOrEqual(0) }, // Estoque abaixo do mínimo
      ],
    });

    for (const product of productsWithIssues) {
      const existingNotice = await this.noticeRepository.findOne({
        where: { product: { id: product.id }, resolved: false },
      });

      if (!existingNotice) {
        const notice = this.noticeRepository.create({
          product,
          message: `Produto "${product.name}" está com ${product.stockQuantity} unidades, abaixo do mínimo de ${product.minimumStock}.`,
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

  async getNotices() {
    /* gera automaticamente */
    await this.generateNotices();

    return this.noticeRepository.find({
      where: { resolved: false },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
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
