import Koa, { Context } from 'koa'
import koaBodyparser from 'koa-bodyparser'

import {
  __,
  allPass,
  andThen,
  call,
  compose,
  concat,
  equals,
  F,
  is,
  isNil,
  has,
  head,
  identity,
  ifElse,
  includes,
  last,
  pathOr,
  propOr,
  split,
  tail,
  unless,
  when,
} from 'ramda'

import {
  APP_URL,
  APP_PORT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  GIPHY_API_KEY,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_USERS,
} from './constants'

import bot from './bot'
import db from './db'
import { dotPath, env, log } from './utils'

import './library'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      [APP_URL]: string
      [APP_PORT]: string
      [DATABASE_HOST]: string
      [DATABASE_NAME]: string
      [DATABASE_USER]: string
      [DATABASE_PASSWORD]: string
      [GIPHY_API_KEY]: string
      [TELEGRAM_BOT_TOKEN]: string
      [TELEGRAM_USERS]: string
    }
  }
}

const app = new Koa()
app.use(koaBodyparser())

app.use((context, next) => {
  const isPostMethod = compose(equals('POST'), dotPath('request.method'))
  const eqEnv = (variable: string) => equals(env(variable))
  const getRoute = compose(ifElse(is(String), tail, F), dotPath('request.url'))
  const compareUrl = compose(eqEnv(TELEGRAM_BOT_TOKEN), getRoute)
  const isAppUrl = ifElse(is(Object), compareUrl, F)
  const getId = pathOr('', ['from', 'id'])
  const message = propOr(null, 'message')
  const query = propOr(null, 'callback_query')
  const getMessage = ifElse(has('message'), message, query)
  const getUserId = compose(getId, getMessage, dotPath('request.body'))
  const getUsers = identity(JSON.parse(env(TELEGRAM_USERS)))
  const isAcceptableUser = compose(includes(__, getUsers), getUserId)
  const callLast = compose(call, last)
  const handleMessage = ifElse(
    compose(allPass([isPostMethod, isAppUrl, isAcceptableUser]), head),
    compose((ctx: Context) => {
      bot.handleUpdate(ctx.request.body, ctx.res)
      // eslint-disable-next-line fp/no-mutation
      ctx.status = 200
    }, head),
    callLast,
  )

  return handleMessage([context, next])
})

app.listen(env(APP_PORT), () => {
  const getBotIdByToken = compose(head, split(':'))
  const showBotUsernameByToken = when(
    is(String),
    compose(
      andThen(
        compose(
          unless(isNil, compose(log('Bot username: '), concat('@'))),
          propOr(null, 'username'),
        ),
      ),
      (id: any) => bot.telegram.getChat(id),
      getBotIdByToken,
    ),
  )
  showBotUsernameByToken(env(TELEGRAM_BOT_TOKEN))
})

db.connect().then(() => log('Database:', 'connected'))
