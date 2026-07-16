import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Room } from './room.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RoomStatus } from './room-status.enum';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(code: string, ownerId: number, cost: number): Promise<Room> {
    const queryRunner = this.roomsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.usersService.findOne(
        ownerId,
        queryRunner.manager,
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.credits < cost) {
        throw new BadRequestException(`Need ${cost} credits`);
      }

      await this.usersService.withdrawCredits(
        ownerId,
        cost,
        queryRunner.manager,
      );

      const roomRepo = queryRunner.manager.getRepository(Room);
      const room = roomRepo.create({
        code,
        ownerId,
        statusId: RoomStatus.WAITING,
        cost,
      });
      const savedRoom = await roomRepo.save(room);

      await this.notificationsService.create(
        ownerId,
        'room_created',
        `Room ${code} successfully created for ${cost} credits`,
      );

      await queryRunner.commitTransaction();
      return savedRoom;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findToJoin(userId: number): Promise<Room[]> {
    return this.roomsRepo.find({
      where: [
        {
          statusId: RoomStatus.WAITING,
          ownerId: Not(userId),
        },
        {
          statusId: RoomStatus.OWNER_READY,
          ownerId: Not(userId),
        },
      ],
      relations: ['owner'],
      select: {
        id: true,
        code: true,
        statusId: true,
        cost: true,
        owner: {
          id: true,
          username: true,
        },
      },
    });
  }

  async joinRoom(code: string, userId: number): Promise<Room> {
    const queryRunner = this.roomsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const repo = queryRunner.manager.getRepository(Room);
      const room = await repo.findOne({
        where: { code },
        relations: ['owner', 'guest'],
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (room.ownerId === userId || room.guestId === userId) {
        return room;
      }

      if (
        room.statusId !== RoomStatus.WAITING &&
        room.statusId !== RoomStatus.OWNER_READY
      ) {
        throw new BadRequestException('Room already started or unavailable');
      }

      const user = await this.usersService.findOne(userId, queryRunner.manager);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.credits < room.cost) {
        throw new BadRequestException(`Need ${room.cost} credits`);
      }

      await this.usersService.withdrawCredits(
        userId,
        room.cost,
        queryRunner.manager,
      );
      room.guestId = userId;
      room.statusId = RoomStatus.PLAYING;

      const savedJoin = await repo.save(room);
      await queryRunner.commitTransaction();

      return savedJoin;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByCode(code: string): Promise<Room | null> {
    return this.roomsRepo.findOne({
      where: { code },
      relations: ['owner', 'guest'],
    });
  }

  async findMine(userId: number): Promise<Room[]> {
    return this.roomsRepo.find({
      where: [
        { ownerId: userId, statusId: RoomStatus.WAITING },
        { ownerId: userId, statusId: RoomStatus.OWNER_READY },
        { ownerId: userId, statusId: RoomStatus.GUEST_READY },
        { ownerId: userId, statusId: RoomStatus.PLAYING },
        { guestId: userId, statusId: RoomStatus.WAITING },
        { guestId: userId, statusId: RoomStatus.OWNER_READY },
        { guestId: userId, statusId: RoomStatus.GUEST_READY },
        { guestId: userId, statusId: RoomStatus.PLAYING },
      ],
      relations: ['owner', 'guest'],
      select: {
        id: true,
        code: true,
        statusId: true,
        cost: true,
        ownerId: true,
        guestId: true,
        owner: { id: true, username: true },
        guest: { id: true, username: true },
      },
    });
  }

  async remove(code: string, userId: number): Promise<Room> {
    const queryRunner = this.roomsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const repo = queryRunner.manager.getRepository(Room);
      const room = await repo.findOne({
        where: { code },
        relations: ['owner', 'guest'],
      });
      if (!room) {
        throw new NotFoundException('Room not found');
      }
      if (room.ownerId !== userId) {
        throw new ForbiddenException('You are not the owner');
      }

      await this.usersService.addCredits(
        room.ownerId,
        room.cost,
        queryRunner.manager,
      );

      if (room.guestId) {
        await this.usersService.addCredits(
          room.guestId,
          room.cost,
          queryRunner.manager,
        );
      }

      await this.notificationsService.create(
        room.ownerId,
        'room_removed',
        `Room ${room.code} successfully removed`,
      );
      const removed = await repo.remove(room);
      await queryRunner.commitTransaction();
      return removed;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async leaveRoom(code: string, userId: number): Promise<Room | null> {
    const queryRunner = this.roomsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const repo = queryRunner.manager.getRepository(Room);
      const room = await repo.findOne({
        where: { code },
        relations: ['owner', 'guest'],
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (room.guestId !== userId) {
        throw new ForbiddenException('You are not the guest');
      }

      await this.usersService.addCredits(
        userId,
        room.cost,
        queryRunner.manager,
      );

      room.guestId = null;
      room.statusId = RoomStatus.WAITING;
      await repo.save(room);

      const updated = await repo.findOne({
        where: { code },
        relations: ['owner', 'guest'],
      });

      await queryRunner.commitTransaction();
      return updated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
