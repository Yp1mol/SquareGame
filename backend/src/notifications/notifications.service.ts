import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(userId: number, type: string, message: string) {
    const notification = this.notificationRepository.create({
      userId,
      type,
      message,
    });

    return this.notificationRepository.save(notification);
  }

  async getAll(userId: number) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(userId: number, notificationId: number) {
    return this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true },
    );
  }

  async delete(userId: number, notificationId: number) {
    return this.notificationRepository.delete({ id: notificationId, userId });
  }

  async deleteAll(userId: number) {
    return this.notificationRepository.delete({ userId });
  }
}
