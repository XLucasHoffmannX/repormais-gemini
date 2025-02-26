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
import { UnitEntity } from '../../unity/entities/unity.entity';
import { UserEntity } from '../../user/entities/user.entity';

export enum WithdrawType {
  ENTRY = 'entry', // Entrada de produto no estoque
  REMOVE = 'remove', // Saída de produto do estoque
}

@Entity({ name: 'withdraws' })
export class WithdrawEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Identificador único do registro de retirada/entrada

  @ManyToOne(() => ProductEntity, { nullable: false })
  product: ProductEntity; // Produto retirado ou adicionado

  @ManyToOne(() => UnitEntity, { nullable: false })
  unit: UnitEntity; // Unidade onde a retirada ou entrada ocorreu

  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity; // Usuário responsável pela ação

  @Column({
    type: 'enum',
    enum: WithdrawType,
    nullable: false,
  })
  type: WithdrawType; // Tipo da movimentação (entrada ou saída)

  @Column({ type: 'int', nullable: false })
  quantity: number; // Quantidade movimentada

  @Column({ type: 'text', nullable: true })
  reason: string; // Motivo da retirada/entrada (exemplo: "Compra de fornecedor", "Uso interno")

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // Data e hora da movimentação

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; // Data e hora da última atualização

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date; // Data de exclusão lógica (caso seja necessário restaurar)
}
