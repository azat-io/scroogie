import { Context as TelegrafContext } from 'telegraf'

import { SET_COST_SUM } from '../constants'
import state from './state'

const setBudget = (context: TelegrafContext): void => {
  context.reply('Пришлите имя обязательной траты')
  state.setStatus(SET_COST_SUM)
}

export default setBudget
