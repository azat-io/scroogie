import { Context as TelegrafContext } from 'telegraf'

import {
  andThen,
  both,
  compose,
  dec,
  has,
  ifElse,
  is,
  join,
  length,
  lt,
  lte,
  prop,
  remove,
} from 'ramda'

import { getSettings, updateCosts } from '../api'
import { BASE } from '../constants'
import { getMessageFromContext } from './helpers'
import state from './state'
import { Cost, Settings } from '../typings'
import { isNumeric } from '../utils'

const removeCostNum = (context: TelegrafContext) =>
  compose(
    ifElse(
      isNumeric,
      compose(
        andThen(
          ifElse(
            both(is(Object), has('costs')),
            ifElse(
              compose(
                both(lt(0), lte(parseInt(getMessageFromContext(context), 10))),
                length,
                prop('costs') as (settings: Settings) => Cost[],
              ),
              compose(
                andThen(() => {
                  context.reply(
                    join('', [
                      'Трата успешно удалена, для просмотра новых настроек ',
                      'отправьте команду /get_settings',
                    ]),
                  )
                  state.setStatus(BASE)
                }),
                updateCosts,
                remove(dec(parseInt(getMessageFromContext(context), 10)), 1),
                prop('costs'),
              ),
              () => context.reply('Трата не найдена'),
            ),
            () => context.reply('У вас нет обязательных трат'),
          ),
        ),
        getSettings,
      ),
      () => context.reply('Введите номер обязательной траты из списка'),
    ),
    getMessageFromContext,
  )(context)

export default removeCostNum
