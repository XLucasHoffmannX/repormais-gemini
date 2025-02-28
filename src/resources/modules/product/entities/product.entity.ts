import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UnitEntity } from '../../unity/entities/unity.entity';
import { NoticeEntity } from '../../notice/entities/notice.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Identificador único do produto

  /* gerar avisos */
  @OneToMany(() => NoticeEntity, (notice) => notice.product)
  notices: NoticeEntity[];

  @ManyToOne(() => UnitEntity, (unit) => unit.products, { nullable: false })
  unitEntity: UnitEntity; // Relacionamento com a unidade onde o produto está armazenado

  @Column({ name: 'name', length: 100, nullable: false })
  name: string; // Nome do produto

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string; // Descrição do produto

  @Column({ name: 'barcode', length: 50, unique: true, nullable: true })
  barcode: string; // Código de barras do produto (opcional)

  @Column({ name: 'category', length: 50, nullable: true })
  category: string; // Categoria do produto (exemplo: alimentos, eletrônicos)

  @Column({ name: 'brand', length: 50, nullable: true })
  brand: string; // Marca do produto

  @Column({ name: 'supplier', length: 100, nullable: true })
  supplier: string; // Nome do fornecedor do produto

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  costPrice: number; // Preço de custo do produto

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salePrice: number; // Preço de venda do produto

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number; // Quantidade atual em estoque

  @Column({ name: 'minimum_stock', type: 'int', default: 0 })
  minimumStock: number; // Quantidade mínima antes de gerar um alerta de reposição

  @Column({ name: 'unit', length: 20, nullable: false })
  unit: string; // Unidade de medida (exemplo: unidade, kg, litros)

  @Column({ name: 'location', length: 100, nullable: true })
  location: string; // Localização do produto dentro do estoque

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate: Date; // Data de validade do produto (se aplicável)

  @Column({ name: 'batch', length: 50, nullable: true })
  batch: string; // Número do lote do produto (se aplicável)

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string; // ID do usuário que criou

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string; // ID do usuário que fez a última alteração

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // Data de criação do registro

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; // Data da última atualização do registro

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date; // Data de exclusão lógica do registro
}
