import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum AccessPermission {
  NO_ACCESS = 'NO_ACCESS',
  READ = 'READ',
  READ_WRITE = 'READ_WRITE',
}

export class RoleMenuUpsertDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsNumber()
  menu_id: number;

  @IsEnum(AccessPermission)
  access_permission: AccessPermission;
}
