import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'waiting' })
  status: string;

  @Column({ default: 0 })
  ownerScore: number;

  @Column({ default: 0 })
  guestScore: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true })
  guestId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest: User;
}
