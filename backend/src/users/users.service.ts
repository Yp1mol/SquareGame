import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  create(data: Partial<User>) {
    const user = this.usersRepo.create(data);

    return this.usersRepo.save(user);
  }

  findOne(id: number) {
    return this.usersRepo.findOne({
      where: { id },
      select: ['id', 'username', 'password']
    });
  }

  findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }
  async updateUsername(id: number, username: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    
    if (!user) {
      throw new Error('User not found');
    }
    user.username = username;
    await this.usersRepo.save(user);

    return { id: user.id, username: user.username, };
  }
}