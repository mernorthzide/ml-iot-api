import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleMenuUpsertDto } from './role-menu-upsert.dto';

export class RoleUpsertDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleMenuUpsertDto)
  role_menu: RoleMenuUpsertDto[];
}
