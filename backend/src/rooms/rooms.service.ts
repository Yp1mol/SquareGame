import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Room } from './room.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async create(code: string, ownerId: number, cost: number) {
    const queryRunner = this.roomsRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.usersService.findOne(
        ownerId,
        queryRunner.manager,
      );

      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < cost) {
        throw new Error(`need ${cost} credit`);
      }

      await this.usersService.withdrawCredits(
        ownerId,
        cost,
        queryRunner.manager,
      );
      const roomRepo = queryRunner.manager.getRepository(Room);
      const room = this.roomsRepo.create({
        code,
        ownerId,
        status: 'draft',
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
        throw new Error('Room not found');
      }

      if (room.ownerId === userId || room.guestId === userId) {
        return room;
      }

      if (room.status !== 'waiting') {
        throw new Error('Room already started');
      }
      const user = await this.usersService.findOne(userId, queryRunner.manager);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < room.cost) {
        throw new Error(`need ${room.cost} credits`);
      }

      await this.usersService.withdrawCredits(
        userId,
        room.cost,
        queryRunner.manager,
      );
      room.guestId = userId;
      room.status = 'playing';

      const savedjoin = await repo.save(room);
      await queryRunner.commitTransaction();

      return savedjoin;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
        { ownerId: userId, status: 'draft' },
        { ownerId: userId, status: 'waiting' },
        { ownerId: userId, status: 'playing' },
        { guestId: userId, status: 'waiting' },
        { guestId: userId, status: 'playing' },
      ],
      relations: ['owner', 'guest'],
      select: {
        id: true,
        code: true,
        status: true,
        cost: true,
        ownerId: true,
        guestId: true,
        ownerReady: true,
        guestReady: true,
        owner: { id: true, username: true },
        guest: { id: true, username: true },
      },
    });
  }

  async remove(code: string, userId: number) {
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
        throw new Error('Room not found');
      }
      if (room.ownerId !== userId) {
        throw new Error('You are not the owner');
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

  async leaveRoom(code: string, userId: number) {
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
        throw new Error('Room not found');
      }

      if (room.guestId !== userId) {
        throw new Error('You are not the guest');
      }

      if (room.guestId === null) {
        throw new Error('Already left');
      }

      await this.usersService.addCredits(
        userId,
        room.cost,
        queryRunner.manager,
      );

      await repo.update({ code }, { guestId: null, status: 'waiting' });

      const updated = repo.findOne({
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
