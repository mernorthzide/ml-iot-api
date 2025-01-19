import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IotDevice } from '../../iot-device/entities/iot-device.entity';

@Entity()
export class SchneiderPm2200Data {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  iot_device_id: number;

  @ManyToOne(() => IotDevice)
  @JoinColumn({ name: 'iot_device_id' })
  iot_device: IotDevice;

  @Column({ type: 'float', nullable: true })
  active_energy_delivered_into_load_2700: number;

  @Column({ type: 'float', nullable: true })
  current_a_3000: number;

  @Column({ type: 'float', nullable: true })
  current_b_3002: number;

  @Column({ type: 'float', nullable: true })
  current_c_3004: number;

  @Column({ type: 'float', nullable: true })
  current_n_3006: number;

  @Column({ type: 'float', nullable: true })
  current_average_3010: number;

  @Column({ type: 'float', nullable: true })
  voltage_a_b_3020: number;

  @Column({ type: 'float', nullable: true })
  voltage_b_c_3022: number;

  @Column({ type: 'float', nullable: true })
  voltage_c_a_3024: number;

  @Column({ type: 'float', nullable: true })
  voltage_l_l_avg_3026: number;

  @Column({ type: 'float', nullable: true })
  voltage_a_n_3028: number;

  @Column({ type: 'float', nullable: true })
  voltage_b_n_3030: number;

  @Column({ type: 'float', nullable: true })
  voltage_c_n_3032: number;

  @Column({ type: 'float', nullable: true })
  voltage_l_n_average_3036: number;

  @Column({ type: 'float', nullable: true })
  active_power_a_3054: number;

  @Column({ type: 'float', nullable: true })
  active_power_b_3056: number;

  @Column({ type: 'float', nullable: true })
  active_power_c_3058: number;

  @Column({ type: 'float', nullable: true })
  active_power_total_3060: number;

  @Column({ type: 'float', nullable: true })
  power_factor_total_3084: number;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  created_at: Date;
}
