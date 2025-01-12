import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedSuperAdmin();
  }

  private async seedRoles() {
    const defaultRoles = ['Admin'];

    for (const roleName of defaultRoles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!existingRole) {
        const role = this.roleRepository.create({
          name: roleName,
        });
        await this.roleRepository.save(role);
      }
    }
  }

  private async seedSuperAdmin() {
    const roles = await this.roleRepository.find();

    for (const role of roles) {
      // Create email by converting role name to lowercase and replacing spaces with dots
      const email = role.name.toLowerCase().replace(/\s+/g, '.');

      const existingUser = await this.userRepository.findOne({
        where: { email: `${email}@ml-iot.com` },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('P@ssw0rd', 10);
        const user = this.userRepository.create({
          name: role.name,
          email: `${email}@ml-iot.com`,
          password: hashedPassword,
          is_active: true,
          role_id: role.id,
        });
        await this.userRepository.save(user);
      }
    }
  }
}
