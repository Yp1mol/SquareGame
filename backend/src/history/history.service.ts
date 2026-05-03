import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepo: Repository<History>,
  ) {}

  async create(data: Partial<History>) {
    const record = this.historyRepo.create(data);

    return this.historyRepo.save(record);
  }

  async getUserHistory(userId: number) {
    return this.historyRepo.find({
      where: [{ winnerId: userId }, { loserId: userId }],
      relations: ['room', 'winner', 'loser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    return this.historyRepo.findOne({
      where: { id },
      relations: ['room', 'winner', 'loser'],
    });
  }
}
