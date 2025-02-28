import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';

export enum NoticeType {
  EXPIRATION_WARNING = 'EXPIRATION_WARNING',
  STOCK_WARNING = 'STOCK_WARNING',
}

@Entity('notices')
export class NoticeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NoticeType, nullable: false })
  type: NoticeType;

  @Column()
  message: string;

  @Column({ default: false })
  resolved: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.notices)
  product: ProductEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // Data de criação do registro

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; // Data da última atualização do registro

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date; // Data de exclusão lógica do registro
}
