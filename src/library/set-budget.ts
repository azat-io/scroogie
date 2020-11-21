import { Context as TelegrafContext } from 'telegraf'

import { SET_BUDGET_SUM } from '../constants'
import state from './state'

const setBudget = (context: TelegrafContext): void => {
  context.reply('Пришлите сумму ежемесячного дохода')
  state.setStatus(SET_BUDGET_SUM)
}

export default setBudget
