import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  create(data: Partial<User>) {
    const user = this.usersRepo.create(data);

    return this.usersRepo.save(user);
  }

  findOne(id: number, entityManager?: EntityManager) {
    const repo = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepo;
    return repo.findOne({
      where: { id },
      select: ['id', 'username', 'password', 'credits'],
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

    return { id: user.id, username: user.username, credits: user.credits };
  }

  async getCredits(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    return { credits: user.credits };
  }

  async addCredits(
    id: number,
    amount: number = 1,
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepo;
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }
    user.credits += amount;

    await this.notificationsService.create(
      id,
      'credits_added',
      ` ${amount} credits added to your account`,
    );

    return repo.save(user);
  }

  async withdrawCredits(
    id: number,
    amount: number = 1,
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepo;
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < amount) {
      throw new Error('Not enough credits');
    }
    user.credits -= amount;

    return repo.save(user);
  }
}
