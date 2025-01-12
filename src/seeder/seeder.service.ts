import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        is_active: true,
      });

      await this.userRepository.save(admin);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
}
