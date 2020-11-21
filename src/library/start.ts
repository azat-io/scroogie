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
  context.replyWithMarkdown(`Привет *${getNameByContext(context)}* ! 🖖`)
}

export default start
