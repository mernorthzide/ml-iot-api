import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../shared/BaseEntity';
import { IotDeviceType } from '../../iot-device-type/entities/iot-device-type.entity';

@Entity()
export class IotDeviceSchedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iot_device_type_id: number;

  @ManyToOne(() => IotDeviceType)
  @JoinColumn({ name: 'iot_device_type_id' })
  iot_device_type: IotDeviceType;

  @Column()
  schedule_interval: string;

  @Column({ default: true })
  is_active: boolean;
}
