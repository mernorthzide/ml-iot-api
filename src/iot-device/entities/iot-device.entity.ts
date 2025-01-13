import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../shared/BaseEntity';
import { IotDeviceType } from '../../iot-device-type/entities/iot-device-type.entity';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class IotDevice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iot_device_type_id: number;

  @ManyToOne(() => IotDeviceType)
  @JoinColumn({ name: 'iot_device_type_id' })
  iot_device_type: IotDeviceType;

  @Column()
  name: string;

  @Column()
  ip: string;

  @Column()
  port: number;

  @Column()
  location_id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ default: true })
  is_active: boolean;
}
