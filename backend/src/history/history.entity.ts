import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { RoomStatus } from '../rooms/room-status.enum';

export interface CellCoordinates {
  x: number;
  y: number;
}

export interface UnitPosition {
  unitId: string;
  cells: CellCoordinates[];
}

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'room_id', nullable: true })
  roomId!: number;

  @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'owner_id' })
  ownerId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Column({ name: 'guest_id', nullable: true })
  guestId!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'guest_id' })
  guest!: User;

  @Column({ name: 'status_id', type: 'int' })
  statusId!: RoomStatus;

  @Column()
  cost!: number;

  @Column({ name: 'owner_positions', type: 'jsonb', nullable: true })
  ownerPositions!: UnitPosition[];

  @Column({ name: 'guest_positions', type: 'jsonb', nullable: true })
  guestPositions!: UnitPosition[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
