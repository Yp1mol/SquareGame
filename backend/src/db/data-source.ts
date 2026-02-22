import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity'; 

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgre',
  password: '123123',
  database: 'game_square',
  entities: [User, Room],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: true, 
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;