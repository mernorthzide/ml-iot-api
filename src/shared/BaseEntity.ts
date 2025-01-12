import { CrudValidationGroups } from '@dataui/crud';
import { IsOptional } from 'class-validator';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export abstract class BaseEntity {
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ nullable: true })
  created_by_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ nullable: true })
  updated_by_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
