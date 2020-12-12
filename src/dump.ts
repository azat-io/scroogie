import { Telegraf } from 'telegraf'
import { execSync } from 'child_process'

import { join } from 'ramda'

import {
  TELEGRAM_BOT_HELPER_TOKEN,
  TELEGRAM_BOT_HELPER_USER,
} from './constants'
import { dbConfig } from './db'
import { env } from './utils'

const dump = () => {
  const filename = `dump_${dbConfig.database}_${Date.now()}.sql`
  const dumpCommand = join('', [
    `pg_dump postgresql://${dbConfig.username}:${dbConfig.password}@`,
    `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
  ])
  const source = execSync(dumpCommand)
  const bot = new Telegraf(env(TELEGRAM_BOT_HELPER_TOKEN))
  bot.telegram.sendDocument(env(TELEGRAM_BOT_HELPER_USER), {
    source,
    filename,
  })
}

export default dump
