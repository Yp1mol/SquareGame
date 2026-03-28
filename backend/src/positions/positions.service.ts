import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { Room } from '../rooms/room.entity';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private roomsService: RoomsService,
  ) {}

  async findByRoomCode(code: string, userId: number) {
    await this.roomsService.joinRoom(code, userId);
    const room = await this.roomRepository.findOne({ where: { code } });

    if (!room) {
      return [];
    }

    return this.positionRepository.find({
      where: {
        roomId: room.id,
        userId: userId,
      },
    });
  }

  async savePositions(
    code: string,
    positions: { unitId: string; x: number; y: number }[],
    userId: number,
  ) {
    await this.roomsService.joinRoom(code, userId);
    const room = await this.roomRepository.findOne({ where: { code } });

    if (!room) {
      throw new Error('Room not found');
    }

    await this.positionRepository.delete({
      roomId: room.id,
      userId: userId,
    });

    const newPositions = positions.map((pos) =>
      this.positionRepository.create({
        roomId: room.id,
        unitId: pos.unitId,
        x: pos.x,
        y: pos.y,
        userId: userId,
      }),
    );

    return this.positionRepository.save(newPositions);
  }
}
