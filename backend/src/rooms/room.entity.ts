import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Position } from '../positions/position.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ default: 'draft' })
  status!: string;

  @Column({ default: false })
  ownerReady!: boolean;

  @Column({ default: false })
  guestReady!: boolean;

  @Column({ default: 0 })
  ownerScore!: number;

  @Column({ default: 0 })
  guestScore!: number;

  @Column()
  ownerId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column({ nullable: true })
  guestId!: number;

  @Column({ default: 1 })
  cost!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest!: User;

  @OneToMany(() => Position, (position) => position.room, { cascade: true })
  positions!: Position[];
}
