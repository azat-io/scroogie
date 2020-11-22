import { Context as TelegrafContext } from 'telegraf'

import {
  always,
  andThen,
  applySpec,
  both,
  compose,
  curry,
  has,
  join,
  ifElse,
  is,
  isEmpty,
  not,
  prop,
  reduce,
} from 'ramda'

import { getSettings as getSettingsApi } from '../api'
import { Cost } from '../typings'
import { formatMoney } from '../utils'

const getSettings = curry((context: TelegrafContext) =>
  compose(
    andThen(
      compose(
        ({
          budget,
          costs,
        }: {
          budget: number | undefined
          costs: Cost[] | undefined
        }) => {
          context.replyWithMarkdown(
            join(' ', [
              'На текущий момент действуют следующие настройки приложения:',
              `\n\n*Доход:* ${budget}\n\n*Обязательные расходы*: ${costs}`,
            ]),
          )
        },
        applySpec({
          budget: ifElse(
            both(is(Object), has('budget')),
            compose(formatMoney, prop('budget')),
            always('Месячный бюджет не задан'),
          ),
          costs: ifElse(
            both(is(Object), compose(not, isEmpty, prop('costs'))),
            compose(
              reduce(
                (result: string, value: Cost): string =>
                  `${result}\n• ${value.name} - ${formatMoney(value.sum)}`,
                '',
              ),
              prop('costs'),
            ),
            always('Обязательные расходы не заданы'),
          ),
        }),
      ),
    ),
    getSettingsApi,
  )(),
)

export default getSettings
