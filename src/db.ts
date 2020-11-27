import { createConnection } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
} from './constants'

import { Category, Purchase, Settings } from './entities'

import { env } from './utils'

const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: env(DATABASE_HOST),
  database: env(DATABASE_NAME),
  username: env(DATABASE_USER),
  password: env(DATABASE_PASSWORD),
  synchronize: true,
  logging: false,
  entities: [Category, Purchase, Settings],
}

const db = {
  connect: async () => createConnection(dbConfig),
}

export default db
