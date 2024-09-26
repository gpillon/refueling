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
          role: 'admin',
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
    const password = bcrypt.hashSync(user.password, 10);
    user.password = password;
    const existingUser = await this.findOne(user.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return this.usersRepository.save(user);
  }

  async update(user: Omit<User, 'id'>): Promise<User> {
    const existingUser = await this.findOne(user.username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }
    if (user.password) {
      const password = bcrypt.hashSync(user.password, 10);
      user.password = password;
    }
    return this.usersRepository.save(user);
  }

  // Add methods for creating users, etc.
}
