import { join } from 'ramda'

import { Context as TelegrafContext } from 'telegraf'

const help = (context: TelegrafContext): void => {
  context.reply(
    join('', [
      'Для того, чтобы добавить покупку, необходимо вписать сумму потраченных денег\n\n',
    ]),
  )
}

export default help
