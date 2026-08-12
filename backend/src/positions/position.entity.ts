import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_id' })
  roomId: number;

  @Column({ name: 'unit_id' })
  unitId: string;

  @Column({ type: 'json', nullable: true })
  cells: { x: number; y: number }[] | null;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
