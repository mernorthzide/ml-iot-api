import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/BaseEntity';

@Entity()
export class ExampleGasConsumption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  station: number;

  @Column('float')
  boiler_1: number;

  @Column('float')
  boiler_2: number;

  @Column('float')
  boiler_3: number;

  @Column('float')
  boiler_4: number;
}
