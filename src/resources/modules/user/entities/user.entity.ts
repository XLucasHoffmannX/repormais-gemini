import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';

export enum Role {
  Viewer = 'VIEWER_USER',
  Owner = 'OWNER_USER',
  Management = 'MANAGEMENT_USER',
  Editor = 'EDITOR_USER',
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 60, nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.Owner })
  role: Role;

  @Column({ name: 'password', nullable: false })
  password: string;

  @ManyToOne(() => CompanyEntity, (company) => company.users, {
    nullable: false,
  })
  company: CompanyEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  upadteAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
