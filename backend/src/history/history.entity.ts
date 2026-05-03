import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomId!: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({ nullable: true })
  winnerId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winnerId' })
  winner!: User;

  @Column({ nullable: true })
  loserId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'loserId' })
  loser!: User;

  @Column()
  cost!: number;

  @Column({ type: 'jsonb', nullable: true })
  ownerPositions!: any;

  @Column({ type: 'jsonb', nullable: true })
  guestPositions!: any;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;
}
