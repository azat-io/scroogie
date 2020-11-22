import { Context as TelegrafContext } from 'telegraf'
import {
  andThen,
  both,
  compose,
  concat,
  has,
  ifElse,
  inc,
  is,
  join,
} from 'ramda'

import { getSettings } from '../api'
import { REMOVE_COST } from '../constants'
import state from './state'
import { Cost, Settings } from '../typings'
import { reduceIndexed } from '../utils'

const removeCost = (context: TelegrafContext) =>
  compose(
    andThen(
      ifElse(
        both(is(Object), has('costs')),
        (settings: Settings) => {
          context.replyWithMarkdown(
            join('', [
              'Для того, чтобы удалить обязательную трату, пришлите номер траты, ',
              'чтоб отменить операцию используйте команду /cancel\n',
              reduceIndexed(
                (accumulator: string, cost: Cost, index: number) =>
                  concat(
                    accumulator,
                    `\n*${inc(index)}*. ${cost.name} - ${cost.sum}`,
                  ),
                '',
                settings.costs,
              ),
            ]),
          )
          state.setStatus(REMOVE_COST)
        },
        () =>
          context.reply(
            'Кажется, в настоящий момент у вас нет обязательных трат',
          ),
      ),
    ),
    getSettings,
  )()

export default removeCost
