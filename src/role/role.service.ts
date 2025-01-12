import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUpsertDto } from './dto/role-upsert.dto';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) repo
  ) {
    super(repo);
  }

  async upsertRole(roleUpsertDto: RoleUpsertDto, user: User) {
    const { id, name, role_menu } = roleUpsertDto;

    // Upsert role
    let role = id
      ? await this.repo.findOne({
          where: { id },
        })
      : null;

    if (!id) {
      role = this.repo.create({
        name,
        created_by_id: user.id,
        updated_by_id: user.id,
      });
    } else {
      role.name = name;
      if (user.id !== role.updated_by_id) {
        role.updated_by_id = user.id;
      }
    }
    await this.repo.save(role);

    return role;
  }
}
