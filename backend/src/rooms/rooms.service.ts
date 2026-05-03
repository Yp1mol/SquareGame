import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Room } from './room.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    private usersService: UsersService,
  ) {}

  async create(code: string, ownerId: number, cost: number) {
    const user = await this.usersService.findOne(ownerId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < cost) {
      throw new Error(`need ${cost} credit`);
    }

    await this.usersService.withdrawCredits(ownerId, cost);
    const room = this.roomsRepo.create({
      code,
      ownerId,
      status: 'draft',
      cost,
    });

    return await this.roomsRepo.save(room);
  }

  async findToJoin(userId: number) {
    return await this.roomsRepo.find({
      where: {
        status: 'waiting',
        ownerId: Not(userId),
        ownerReady: true,
      },
      relations: ['owner'],
      select: {
        id: true,
        code: true,
        status: true,
        cost: true,
        ownerReady: true,
        owner: {
          id: true,
          username: true,
        },
      },
    });
  }

  async joinRoom(code: string, userId: number) {
    const room = await this.roomsRepo.findOne({
      where: { code },
      relations: ['owner', 'guest'],
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.ownerId === userId || room.guestId === userId) {
      return room;
    }

    if (room.status !== 'waiting') {
      throw new Error('Room already started');
    }
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < room.cost) {
      throw new Error(`need ${room.cost} credits`);
    }

    await this.usersService.withdrawCredits(userId, room.cost);
    room.guestId = userId;
    room.status = 'playing';

    return await this.roomsRepo.save(room);
  }

  async findByCode(code: string) {
    return await this.roomsRepo.findOne({
      where: { code },
      relations: ['owner', 'guest'],
    });
  }

  async findMine(userId: number) {
    return await this.roomsRepo.find({
      where: [
        { ownerId: userId, status: 'waiting' },
        { guestId: userId, status: 'waiting' },
      ],
      relations: ['owner', 'guest'],
      select: {
        id: true,
        code: true,
        status: true,
        cost: true,
        owner: {
          id: true,
          username: true,
        },
      },
    });
  }

  async remove(code: string, userId: number) {
    const room = await this.roomsRepo.findOne({
      where: { code },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.ownerId !== userId) {
      throw new Error('You are not the owner of this room');
    }

    if (room.status === 'waiting') {
      await this.usersService.addCredits(userId, room.cost);
    }

    return await this.roomsRepo.remove(room);
  }
}
