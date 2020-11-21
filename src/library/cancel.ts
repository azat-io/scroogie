import { Context as TelegrafContext } from 'telegraf'

import { BASE } from '../constants'
import state from './state'

const cancel = (context: TelegrafContext): void => {
  state.setStatus(BASE)
  state.setCache(null)
  context.reply('Отмена')
}

export default cancel
