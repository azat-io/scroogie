import { Context as TelegrafContext } from 'telegraf'

import {
  compose,
  filter,
  identity,
  join,
  pathOr,
  props,
  isNil,
  unless,
} from 'ramda'

const start = (context: TelegrafContext) => {
  const getNameByContext = compose(
    unless(
      isNil,
      compose(join(' '), filter(identity), props(['first_name', 'last_name'])),
    ),
    pathOr(null, ['message', 'from']),
  ) as (c: TelegrafContext) => string
  context.replyWithMarkdown(
    join('', [
      `Привет *${getNameByContext(context)}* ! 🖖\n\n`,
      'Я Скруджи-бот. Я помогаю вести семейный бюджет. Устанавливай лимит на ',
      'месяц и каждый день добавляй траты по категориям. Я покажу остаток ',
      'бюджета на день, на месяц и выведу подробную статистику в диаграммах. ',
      'Отправь /help, чтобы увидеть инструкцию',
    ]),
  )
}

export default start
