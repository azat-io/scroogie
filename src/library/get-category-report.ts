import { Context as TelegrafContext } from 'telegraf'

import { andThen, compose } from 'ramda'

import { getCategoryReport as getCategoryReportApi } from '../api'

const getCategoryReport = (context: TelegrafContext) =>
  compose(
    andThen(imageBuffer => {
      context.replyWithPhoto({ source: imageBuffer })
    }),
    getCategoryReportApi,
  )()

export default getCategoryReport
