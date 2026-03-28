import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';
import { Position } from '../positions/position.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgre',
  password: '123123',
  database: 'game_square',
  entities: [User, Room, Position],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
