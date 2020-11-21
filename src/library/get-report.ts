import { Context as TelegrafContext } from 'telegraf'

import { andThen, compose } from 'ramda'

import { getReport as getReportApi } from '../api'

const getReport = (context: TelegrafContext) =>
  compose(
    andThen(imageBuffer => {
      context.replyWithPhoto({ source: imageBuffer })
    }),
    getReportApi,
  )()

export default getReport
