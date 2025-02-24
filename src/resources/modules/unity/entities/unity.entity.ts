import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity({ name: 'units' })
export class UnitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Identificador único da unidade

  @OneToMany(() => ProductEntity, (product) => product.unitEntity)
  products: ProductEntity[]; // Relacionamento com os produtos da unidade

  @ManyToOne(() => CompanyEntity, (company) => company.units, {
    nullable: false,
  })
  company: CompanyEntity; // Relacionamento com a empresa que possui essa unidade

  @Column({ name: 'name', length: 100, nullable: false })
  name: string; // Nome da unidade (exemplo: Loja Centro, Armazém 1)

  @Column({ name: 'address', length: 255, nullable: true })
  address: string; // Endereço da unidade
}
