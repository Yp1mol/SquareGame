import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';
import { Position } from '../positions/position.entity';
import { History } from '../history/history.entity';
import * as path from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : 'localhost',
  port: process.env.DATABASE_URL ? undefined : 5432,
  username: process.env.DATABASE_URL ? undefined : 'postgre',
  password: process.env.DATABASE_URL ? undefined : '123123',
  database: process.env.DATABASE_URL ? undefined : 'game_square',
  entities: [User, Room, Position, History],
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  synchronize: true,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
