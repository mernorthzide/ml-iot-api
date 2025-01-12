import { CrudValidationGroups } from '@dataui/crud';
import { IsEmpty, IsOptional } from 'class-validator';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Role extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsEmpty({ groups: [CREATE] })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  name: string;
}
