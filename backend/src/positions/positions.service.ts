import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { Room } from '../rooms/room.entity';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private historyService: HistoryService,
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
  async getByRoomAndUser(roomId: number, userId: number) {
    return this.positionRepository.find({
      where: {
        roomId: roomId,
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

    if (
      (room.ownerId === userId && room.ownerReady) ||
      (room.guestId === userId && room.guestReady)
    ) {
      throw new Error('You have already finished setup');
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
  async deleteByRoomId(roomId: number) {
    return this.positionRepository.delete({ roomId });
  }

  async finishSetup(code: string, userId: number) {
    const room = await this.roomRepository.findOne({ where: { code } });

    if (!room) {
      throw new Error('Room not found');
    }

    const Owner = room.ownerId === userId;
    const Guest = room.guestId === userId;

    if (!Owner && !Guest) {
      throw new Error('You are not a participant of this room');
    }

    const positions = await this.getByRoomAndUser(room.id, userId);

    if (positions.length !== 2) {
      throw new Error('Please place both units before finishing');
    }

    if (Owner) {
      room.ownerReady = true;
      room.status = 'waiting';
      await this.roomRepository.save(room);

      return {
        message: 'Setup finished. Room is now visible to other players.',
      };
    }

    if (Guest) {
      room.guestReady = true;
      await this.roomRepository.save(room);

      return this.finishRoom(room);
    }
  }

  async finishRoom(room: Room) {
    const ownerPositions = await this.getByRoomAndUser(room.id, room.ownerId);
    const guestPositions = await this.getByRoomAndUser(room.id, room.guestId);
    const result = this.calculateResult(
      ownerPositions,
      guestPositions,
      room.ownerId,
      room.guestId,
    );

    if (!result) {
      await this.usersService.addCredits(room.ownerId, room.cost);
      await this.usersService.addCredits(room.guestId, room.cost);
    }

    if (result) {
      await this.usersService.addCredits(result, room.cost * 2);
    }
    let loser: number | undefined;

    if (result === room.ownerId) {
      loser = room.guestId;
    } else {
      loser = room.ownerId;
    }

    room.status = 'finished';
    await this.roomRepository.save(room);

    await this.historyService.create({
      roomId: room.id,
      winnerId: result ?? undefined,
      loserId: loser ?? undefined,
      cost: room.cost,
      ownerPositions,
      guestPositions,
    });

    return {
      message: 'Battle finished!',
      winnerId: result,
      winnerCredits: result ? room.cost * 2 : 0,
    };
  }

  private calculateResult(
    ownerPositions: Position[],
    guestPositions: Position[],
    ownerId: number,
    guestId: number,
  ): number | null {
    const ownerAttack = ownerPositions.find((p) => p.unitId === 'attack');
    const guestAttack = guestPositions.find((p) => p.unitId === 'attack');
    const ownerProtect = ownerPositions.find((p) => p.unitId === 'protect');
    const guestProtect = guestPositions.find((p) => p.unitId === 'protect');

    if (!ownerAttack || !guestAttack || !ownerProtect || !guestProtect) {
      return null;
    }

    const SIZE = 160;

    const ownerOverlap = this.calculateOverlap(
      ownerAttack.x,
      ownerAttack.y,
      SIZE,
      guestProtect.x,
      guestProtect.y,
      SIZE,
    );

    const guestOverlap = this.calculateOverlap(
      guestAttack.x,
      guestAttack.y,
      SIZE,
      ownerProtect.x,
      ownerProtect.y,
      SIZE,
    );

    if (ownerOverlap > guestOverlap) {
      return ownerId;
    }

    if (guestOverlap > ownerOverlap) {
      return guestId;
    }

    return null;
  }

  private calculateOverlap(
    x1: number,
    y1: number,
    size1: number,
    x2: number,
    y2: number,
    size2: number,
  ): number {
    const left = Math.max(x1, x2);
    const right = Math.min(x1 + size1, x2 + size2);
    const top = Math.max(y1, y2);
    const bottom = Math.min(y1 + size1, y2 + size2);

    if (left < right && top < bottom) {
      return (right - left) * (bottom - top);
    }
    return 0;
  }
}
