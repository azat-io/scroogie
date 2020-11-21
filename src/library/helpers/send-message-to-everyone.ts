import { forEach } from 'ramda'

import bot from '../../bot'

import { env } from '../../utils'

const sendMessageToEveryone = (message: string): void => {
  forEach((userId: number | string) => {
    bot.telegram.sendMessage(userId, message)
  }, JSON.parse(env('TELEGRAM_USERS')))
}

export default sendMessageToEveryone
