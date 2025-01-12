import { CrudValidationGroups } from '@dataui/crud';
import { IsEmail, IsEmpty, IsOptional } from 'class-validator';
import { BaseEntity } from 'src/shared/BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class User extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsEmpty({ groups: [CREATE] })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  name: string;

  @IsEmail()
  @Column({ nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  password?: string;

  @Column({ default: false })
  is_active: boolean;
}
