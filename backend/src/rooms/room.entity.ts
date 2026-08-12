import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Position } from '../positions/position.entity';
import { RoomStatus } from './room-status.enum';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'status_id', type: 'int', default: RoomStatus.WAITING })
  statusId: RoomStatus;

  @Column({ name: 'owner_score', default: 0 })
  ownerScore: number;

  @Column({ name: 'guest_score', default: 0 })
  guestScore: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'guest_id', nullable: true })
  guestId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'guest_id' })
  guest: User;

  @Column({ default: 1 })
  cost: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Position, (position) => position.room, { cascade: true })
  positions: Position[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
