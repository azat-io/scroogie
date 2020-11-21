import { Context as TelegrafContext } from 'telegraf'

import { dotPath } from '../../utils'

const getMessageFromContext = dotPath('message.text') as (
  context: TelegrafContext,
) => string

export default getMessageFromContext
