import { Telegraf } from 'telegraf'

import { join } from 'ramda'

import { APP_URL, TELEGRAM_BOT_TOKEN } from './constants'

import { env } from './utils'

const bot = new Telegraf(env(TELEGRAM_BOT_TOKEN), {
  telegram: { webhookReply: false },
})

const appUrl: string = join('/', [env(APP_URL), env(TELEGRAM_BOT_TOKEN)])

bot.telegram.setWebhook(appUrl)

export default bot
