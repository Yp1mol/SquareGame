import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import moment from 'moment';
import { Room } from './room.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RoomStatus } from './room-status.enum';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    const expiryDate = moment().subtract(7, 'days').toDate();
    await this.roomsRepo
      .createQueryBuilder()
      .delete()
      .from(Room)
      .where('deletedAt <= :expiryDate', { expiryDate })
      .execute();

    await this.roomsRepo
      .createQueryBuilder()
      .softDelete()
      .from(Room)
      .where('createdAt <= :expiryDate', { expiryDate })
      .execute();
  }

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

  async deleteDate(code: string): Promise<Room | null> {
    return this.roomsRepo.findOne({
      where: { code },
      relations: ['owner', 'guest'],
    });
  }

  async findMine(userId: number): Promise<Room[]> {
    return this.roomsRepo.find({
      where: [
        { ownerId: userId, statusId: LessThan(RoomStatus.OWNER_WON) },
        { guestId: userId, statusId: LessThan(RoomStatus.OWNER_WON) },
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
      room.deletedAt = new Date();
      const removed = await repo.save(room);
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
