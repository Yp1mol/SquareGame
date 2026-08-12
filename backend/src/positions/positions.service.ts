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

interface Cell {
  x: number;
  y: number;
}

type PositionInput = {
  unitId: string;
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
      where: {
        roomId: room.id,
        userId: userId,
      },
    });
  }

  async getByRoomAndUser(roomId: number, userId: number): Promise<Position[]> {
    return this.positionRepository.find({
      where: {
        roomId: roomId,
        userId: userId,
      },
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

    const isOwnerReady =
      room.ownerId === userId && room.statusId === RoomStatus.OWNER_READY;
    const isGuestReady =
      room.guestId === userId && room.statusId === RoomStatus.GUEST_READY;

    if (isOwnerReady || isGuestReady) {
      throw new BadRequestException('You have already finished setup');
    }

    const positionsArray = positions || [];

    if (positionsArray.length !== 2) {
      throw new BadRequestException('Two units required (attack and protect)');
    }

    const attack = positionsArray.find((p) => p.unitId === 'attack');
    const protect = positionsArray.find((p) => p.unitId === 'protect');

    if (!attack || !protect) {
      throw new BadRequestException('Two units required (attack and protect)');
    }
    const attackCells = attack.cells;
    const protectCells = protect.cells;

    if (attackCells.length !== protectCells.length) {
      throw new BadRequestException(
        'Attack and protect must have the same number of cells',
      );
    }

    await this.positionRepository.delete({
      roomId: room.id,
      userId: userId,
    });

    const newPositions = positionsArray.map((pos) =>
      this.positionRepository.create({
        roomId: room.id,
        unitId: pos.unitId,
        userId: userId,
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

    if (isOwner) {
      room.statusId = RoomStatus.OWNER_READY;
      await this.roomRepository.save(room);

      return {
        message: 'Setup finished. Room is now visible to other players.',
      };
    }

    if (isGuest) {
      room.statusId = RoomStatus.GUEST_READY;
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
      room.statusId = RoomStatus.DRAW;
    } else if (result === room.ownerId) {
      await this.usersService.addCredits(room.ownerId, room.cost * 2);
      room.statusId = RoomStatus.OWNER_WON;
    } else {
      await this.usersService.addCredits(room.guestId, room.cost * 2);
      room.statusId = RoomStatus.GUEST_WON;
    }

    await this.roomRepository.save(room);

    await this.historyService.create({
      roomId: room.id,
      ownerId: room.ownerId,
      guestId: room.guestId,
      cost: room.cost,
      statusId: room.statusId,
      ownerPositions: ownerPositions,
      guestPositions: guestPositions,
    });

    let ownerMessage = 'Battle finished. It is a draw!';
    let guestMessage = 'Battle finished. It is a draw!';

    if (result === room.ownerId) {
      ownerMessage = 'Battle finished. You won!';
      guestMessage = 'Battle finished. You lost.';
    } else if (result === room.guestId) {
      ownerMessage = 'Battle finished. You lost.';
      guestMessage = 'Battle finished. You won!';
    }

    await this.notificationsService.create(
      room.ownerId,
      'battle_finished',
      ownerMessage,
    );
    await this.notificationsService.create(
      room.guestId,
      'battle_finished',
      guestMessage,
    );

    return {
      message: 'Battle finished!',
      winnerId: result,
      winnerCredits: result ? room.cost * 2 : room.cost,
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

    const ownerAttackCells = ownerAttack.cells || [];
    const guestProtectCells = guestProtect.cells || [];
    const guestAttackCells = guestAttack.cells || [];
    const ownerProtectCells = ownerProtect.cells || [];

    if (
      ownerAttackCells.length === 0 ||
      guestProtectCells.length === 0 ||
      guestAttackCells.length === 0 ||
      ownerProtectCells.length === 0
    ) {
      return null;
    }

    const ownerOverlap = this.calculateGridOverlap(
      ownerAttackCells,
      guestProtectCells,
    );
    const guestOverlap = this.calculateGridOverlap(
      guestAttackCells,
      ownerProtectCells,
    );

    if (ownerOverlap > guestOverlap) {
      return ownerId;
    }
    if (guestOverlap > ownerOverlap) {
      return guestId;
    }

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
