import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/BaseEntity';

@Entity()
export class ExampleBoilerPressure extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boiler_1_ton: number;

  @Column()
  boiler_2_ton: number;

  @Column()
  boiler_3_ton: number;

  @Column()
  boiler_4_ton: number;
}
