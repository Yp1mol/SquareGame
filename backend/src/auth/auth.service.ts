import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) { }
  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      throw new BadRequestException('Wrong password');
    }

    return {
      access_token: await this.jwt.signAsync({
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async register(username: string, password: string) {
    const existing = await this.users.findByUsername(username);

    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const psw = await bcrypt.hash(password, 10);
    const user = await this.users.create({
      username,
      password: psw,
    });

    return { id: user.id, username: user.username };
  }
}