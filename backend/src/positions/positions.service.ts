import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { Room } from '../rooms/room.entity';
import { UsersService } from '../users/users.service';
import { HistoryService } from '../history/history.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RoomStatus } from '../rooms/room-status.enum';
import { UnitType } from './unitType.enum';

interface Cell {
  x: number;
  y: number;
}

type PositionInput = {
  unitId: UnitType;
  cells: Cell[];
};

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly usersService: UsersService,
    private readonly historyService: HistoryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findByRoomCode(code: string, userId: number): Promise<Position[]> {
    const room = await this.roomRepository.findOne({ where: { code } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.ownerId !== userId && room.guestId !== userId) {
      throw new ForbiddenException('You are not a participant of this room');
    }

    return this.positionRepository.find({
      where: { roomId: room.id, userId },
    });
  }

  async getByRoomAndUser(roomId: number, userId: number): Promise<Position[]> {
    return this.positionRepository.find({
      where: { roomId, userId },
    });
  }

  async savePositions(
    code: string,
    positions: PositionInput[] | undefined,
    userId: number,
  ): Promise<Position[]> {
    const room = await this.roomRepository.findOne({ where: { code } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.ownerId !== userId && room.guestId !== userId) {
      throw new ForbiddenException('You are not a participant of this room');
    }

    if (
      (room.ownerId === userId && room.statusId === RoomStatus.OWNER_READY) ||
      (room.guestId === userId && room.statusId === RoomStatus.GUEST_READY)
    ) {
      throw new BadRequestException('You have already finished setup');
    }

    const positionsArray = positions || [];

    if (positionsArray.length !== 2) {
      throw new BadRequestException('Two units required (attack and protect)');
    }

    const attack = positionsArray.find((p) => p.unitId === UnitType.ATTACK);
    const protect = positionsArray.find((p) => p.unitId === UnitType.PROTECT);

    if (!attack || !protect || attack.cells.length !== protect.cells.length) {
      throw new BadRequestException('Invalid units configuration');
    }

    await this.positionRepository.delete({ roomId: room.id, userId });

    const newPositions = positionsArray.map((pos) =>
      this.positionRepository.create({
        roomId: room.id,
        unitId: pos.unitId,
        userId,
        cells: pos.cells || [],
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
      throw new NotFoundException('Room not found');
    }

    const isOwner = room.ownerId === userId;
    const isGuest = room.guestId === userId;

    if (!isOwner && !isGuest) {
      throw new ForbiddenException('You are not a participant of this room');
    }

    const positions = await this.getByRoomAndUser(room.id, userId);

    if (positions.length !== 2) {
      throw new BadRequestException('Save your locations at first please');
    }

    room.statusId = isOwner ? RoomStatus.OWNER_READY : RoomStatus.GUEST_READY;
    await this.roomRepository.save(room);

    if (!isOwner) {
      return this.finishRoom(room);
    }

    return { status: room.statusId };
  }

  async finishRoom(room: Room) {
    const ownerPositions = await this.getByRoomAndUser(room.id, room.ownerId);
    const guestPositions = await this.getByRoomAndUser(room.id, room.guestId);

    const winnerId = this.calculateResult(
      ownerPositions,
      guestPositions,
      room.ownerId,
      room.guestId,
    );

    if (winnerId === room.ownerId) {
      await this.usersService.addCredits(room.ownerId, room.cost * 2);
      room.statusId = RoomStatus.OWNER_WON;
    } else if (winnerId === room.guestId) {
      await this.usersService.addCredits(room.guestId, room.cost * 2);
      room.statusId = RoomStatus.GUEST_WON;
    } else {
      await this.usersService.addCredits(room.ownerId, room.cost);
      await this.usersService.addCredits(room.guestId, room.cost);
      room.statusId = RoomStatus.DRAW;
    }

    await this.roomRepository.save(room);

    await this.historyService.create({
      roomId: room.id,
      ownerId: room.ownerId,
      guestId: room.guestId,
      cost: room.cost,
      statusId: room.statusId,
      ownerPositions,
      guestPositions,
    });

    await this.notificationsService.create(
      room.ownerId,
      'battle_finished',
      room.statusId.toString(),
    );
    await this.notificationsService.create(
      room.guestId,
      'battle_finished',
      room.statusId.toString(),
    );

    return {
      status: room.statusId,
      winnerId,
      winnerCredits: winnerId ? room.cost * 2 : room.cost,
    };
  }

  private calculateResult(
    ownerPositions: Position[],
    guestPositions: Position[],
    ownerId: number,
    guestId: number,
  ): number | null {
    const ownerAttack = ownerPositions.find(
      (p) => p.unitId === UnitType.ATTACK,
    );
    const guestAttack = guestPositions.find(
      (p) => p.unitId === UnitType.ATTACK,
    );
    const ownerProtect = ownerPositions.find(
      (p) => p.unitId === UnitType.PROTECT,
    );
    const guestProtect = guestPositions.find(
      (p) => p.unitId === UnitType.PROTECT,
    );

    if (!ownerAttack || !guestAttack || !ownerProtect || !guestProtect) {
      return null;
    }

    const ownerOverlap = this.calculateGridOverlap(
      ownerAttack.cells,
      guestProtect.cells,
    );
    const guestOverlap = this.calculateGridOverlap(
      guestAttack.cells,
      ownerProtect.cells,
    );

    if (ownerOverlap > guestOverlap) return ownerId;
    if (guestOverlap > ownerOverlap) return guestId;

    return null;
  }

  private calculateGridOverlap(arrayA: Cell[], arrayB: Cell[]): number {
    const setA = new Set(arrayA.map((cell) => `${cell.x},${cell.y}`));

    let overlapCells = 0;
    for (const cell of arrayB) {
      if (setA.has(`${cell.x},${cell.y}`)) {
        overlapCells++;
      }
    }

    return overlapCells;
  }
}
