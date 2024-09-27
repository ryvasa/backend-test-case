import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import MemberSeeder from './seeds/member.seeder';
import BookSeeder from './seeds/book.seeder';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  synchronize: true,
  seeds: [MemberSeeder, BookSeeder],
};
const AppDataSource = new DataSource(options);
export default AppDataSource;
