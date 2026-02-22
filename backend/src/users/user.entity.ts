import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../rooms/room.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Room, (room) => room.owner)
  ownedRooms: Room[];

  @OneToMany(() => Room, (room) => room.guest)
  guestRooms: Room[];
}