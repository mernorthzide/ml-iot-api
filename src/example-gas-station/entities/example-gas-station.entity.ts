import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/BaseEntity';

@Entity()
export class ExampleGasStation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bar_left: number;

  @Column()
  bar_right: number;
}
