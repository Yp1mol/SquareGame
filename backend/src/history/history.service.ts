import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';
import { Position } from '../positions/position.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
    @InjectRepository(Position)
    private readonly positionRepo: Repository<Position>,
  ) {}

  async create(data: Partial<History>) {
    const record = this.historyRepo.create(data);
    return this.historyRepo.save(record);
  }

  async getUserHistory(userId: number) {
    return this.historyRepo.find({
      where: [{ ownerId: userId }, { guestId: userId }],
      relations: ['room', 'owner', 'guest'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    const history = await this.historyRepo.findOne({
      where: { id },
      relations: ['room', 'owner', 'guest'],
    });

    if (!history) {
      throw new NotFoundException('Battle history not found');
    }

    return history;
  }
  async deleteAll(userId: number) {
    return this.historyRepo.delete([{ ownerId: userId }, { guestId: userId }]);
  }
}
