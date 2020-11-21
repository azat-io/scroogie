import { forEach } from 'ramda'

import bot from '../../bot'

import { env } from '../../utils'

const sendPhotoToEveryone = (source: string): void => {
  forEach((userId: number | string) => {
    bot.telegram.sendPhoto(userId, { source })
  }, JSON.parse(env('TELEGRAM_USERS')))
}

export default sendPhotoToEveryone
