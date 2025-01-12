import { Role } from "src/role/entities/role.entity";

export interface UserJwtPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
  role_id: number;
}
