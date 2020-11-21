import { Context as TelegrafContext } from 'telegraf'

import {
  andThen,
  applySpec,
  both,
  compose,
  has,
  ifElse,
  is,
  unary,
} from 'ramda'

import { setSettings } from '../api'
import { BASE } from '../constants'
import { getMessageFromContext } from './helpers'
import state from './state'
import { Cost } from '../typings'
import { isNumeric } from '../utils'

const setCostSum = compose(
  ifElse(
    compose(both(is(Object), has('name')), () => state.getCache()),
    ifElse(
      compose(isNumeric, getMessageFromContext),
      compose(
        andThen(() => {
          state.setStatus(BASE)
          state.setCache(null)
        }),
        setSettings,
        applySpec({
          cost: {
            name: () => state.getCache().name,
            sum: unary(parseInt),
          },
        }) as (message: string) => { cost: Cost },
        getMessageFromContext,
      ),
      (context: TelegrafContext) => {
        context.reply('Сумма обязательной траты должна быть числом')
      },
    ),
    (context: TelegrafContext) => {
      const name: string = getMessageFromContext(context)
      state.setCache({
        name,
      })
      context.reply(`Пришлите сумму обязательной траты "${name}"`)
    },
  ),
)

export default setCostSum
