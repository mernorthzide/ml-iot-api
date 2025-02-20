import { ApiProperty } from '@nestjs/swagger';

// Constants for Schneider PM2200 registers
export const PM2200_REGISTERS = {
  ACTIVE_ENERGY: {
    DELIVERED_INTO_LOAD: 2699,
  },
  CURRENT: {
    A: 2999,
    B: 3001,
    C: 3003,
    N: 3005,
    AVERAGE: 3009,
  },
  VOLTAGE: {
    A_B: 3019,
    B_C: 3021,
    C_A: 3023,
    L_L_AVG: 3025,
    A_N: 3027,
    B_N: 3029,
    C_N: 3031,
    L_N_AVG: 3035,
  },
  ACTIVE_POWER: {
    A: 3053,
    B: 3055,
    C: 3057,
    TOTAL: 3059,
  },
  POWER_FACTOR: {
    TOTAL: 3083,
  },
};

export interface DeviceReadings {
  active_energy_delivered_into_load?: number;
  current?: {
    a?: number;
    b?: number;
    c?: number;
    n?: number;
    average?: number;
  };
  voltage?: {
    a_b?: number;
    b_c?: number;
    c_a?: number;
    l_l_avg?: number;
    a_n?: number;
    b_n?: number;
    c_n?: number;
    l_n_avg?: number;
  };
  active_power?: {
    a?: number;
    b?: number;
    c?: number;
    total?: number;
  };
  power_factor?: {
    total?: number;
  };
}

export class TestConnectionDto {
  @ApiProperty({ description: 'IP address of the device' })
  ip: string;

  @ApiProperty({ description: 'Port number of the device' })
  port: number;

  @ApiProperty({ description: 'Device ID' })
  device_id: number;
}
