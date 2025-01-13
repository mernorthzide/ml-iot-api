import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/BaseEntity';
import { IotDeviceType } from '../../iot-device-type/entities/iot-device-type.entity';

@Entity()
export class IotDeviceModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  output: string;
}
