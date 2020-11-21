import { forEach } from 'ramda'

import bot from '../../bot'

import { env } from '../../utils'

const sendDocumentToEveryone = (url: string): void => {
  forEach((userId: number | string) => {
    bot.telegram.sendDocument(userId, url)
  }, JSON.parse(env('TELEGRAM_USERS')))
}

export default sendDocumentToEveryone
