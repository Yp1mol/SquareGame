import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
  ) {}

  async create(code: string, ownerId: number) {
    const room = this.roomsRepo.create({
      code,
      ownerId,
      status: 'waiting'
    });
    return await this.roomsRepo.save(room);
  }

  async findByCode(code: string) {
    return await this.roomsRepo.findOne({ where: { code }, relations: ['owner', 'opponent'] });
  }
}