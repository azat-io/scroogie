import { Context as TelegrafContext } from 'telegraf'

import { andThen, applySpec, compose, curry, ifElse, unary } from 'ramda'

import { setSettings } from '../api'
import { BASE } from '../constants'
import { getMessageFromContext } from './helpers'
import state from './state'
import { Settings } from '../typings'
import { formatMoney, isNumeric } from '../utils'

const setBudgetSum = curry((context: TelegrafContext) =>
  ifElse(
    compose(isNumeric, getMessageFromContext),
    compose(
      andThen(
        compose(({ budget }: Settings) => {
          context.reply(`Установлен бюджет ${formatMoney(budget)}`)
          state.setStatus(BASE)
        }),
      ),
      setSettings,
      applySpec({
        budget: unary(parseInt),
      }),
      getMessageFromContext,
    ),
    ({ reply }) => reply('Ежемесячный бюджет должен быть числом'),
  )(context),
)

export default setBudgetSum
