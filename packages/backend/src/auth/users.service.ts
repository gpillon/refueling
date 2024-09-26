import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.seedAdminUser();
  }

  async seedAdminUser() {
    const adminUser = await this.findOne('admin');
    if (adminUser) {
      this.usersRepository.update(
        { username: 'admin' },
        {
          password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin', 10),
        },
      );
      return;
    }
    if (!adminUser) {
      const user = new User();
      user.username = 'admin';
      user.password = bcrypt.hashSync('admin', 10);
      await this.usersRepository.save(user);
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.save(user);
  }

  // Add methods for creating users, etc.
}
