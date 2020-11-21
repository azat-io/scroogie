import { Context as TelegrafContext } from 'telegraf'
import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'

import {
  always,
  andThen,
  applySpec,
  assoc,
  compose,
  curry,
  equals,
  F,
  fromPairs,
  gte,
  ifElse,
  invoker,
  join,
  map,
  path,
  props,
  tap,
  unary,
  when,
} from 'ramda'

import { addPurchase, getCategories } from '../api'
import bot from '../bot'
import { ADD_CATEGORY } from '../constants'
import {
  formatCategoryList,
  getMemeGif,
  getNewPurchaseMessage,
  sendDocumentToEveryone,
  sendMessageToEveryone,
} from './helpers'
import state from './state'
import { Category } from '../typings'
import { dotPath, isNumeric, randomInt } from '../utils'

const base = (context: TelegrafContext) => {
  const MENU_SELECTOR: string = 'select'
  const NEW_CATEGORY_ID: string = '0'
  const PROBABILITY: number = 50
  const showCategories = compose(
    (categories: { [key: string]: string }) => {
      const menu = new MenuTemplate<TelegrafContext>(
        always(
          join('', [
            'Выберите категорию, чтобы добавить трату или нажмите /cancel ',
            'для отмены текущей операции',
          ]),
        ),
      )

      menu.choose(MENU_SELECTOR, categories, {
        do: curry((ctx, key) =>
          compose(
            F,
            invoker(0, 'deleteMessage'),
            ifElse(
              () => equals(NEW_CATEGORY_ID, key),
              tap(({ reply }) => {
                state.setStatus(ADD_CATEGORY)
                reply('Введите название новой категории')
              }),
              tap(
                compose(
                  andThen(
                    compose(
                      when(
                        compose(gte(PROBABILITY), () => randomInt(0, 100)),
                        compose(andThen(sendDocumentToEveryone), getMemeGif),
                      ),
                      sendMessageToEveryone,
                      getNewPurchaseMessage,
                    ),
                  ),
                  addPurchase,
                  applySpec({
                    addedBy: dotPath('update.callback_query.from.id'),
                    categoryId: () => parseInt(key, 10),
                    sum: () => state.getCache().sum,
                  }),
                ),
              ),
            ),
          )(ctx),
        ) as (context: TelegrafContext, key: string) => boolean,
        columns: 1,
        disableChoiceExistsCheck: true,
      })
      const menuMiddleware = new MenuMiddleware<TelegrafContext>(
        '/select/',
        menu,
      )
      bot.use(menuMiddleware.middleware())
      menuMiddleware.replyToContext(context)
    },
    assoc(NEW_CATEGORY_ID, 'Новая категория'),
    fromPairs,
    map(
      (props(['id', 'name']) as unknown) as (
        categories: Category,
      ) => [number, string],
    ),
  )

  const handleMessage = ifElse(
    compose(isNumeric, dotPath('message.text')),
    compose(
      andThen(compose(showCategories, formatCategoryList)),
      getCategories,
      tap(
        compose(
          data => state.setCache(data),
          applySpec({
            addedBy: path(['update', 'message', 'from', 'id']),
            sum: compose(
              unary(parseFloat),
              path(['update', 'message', 'text']) as (
                context: TelegrafContext,
              ) => string,
            ),
          }) as (context: TelegrafContext) => { addedBy: number; sum: number },
        ),
      ),
    ),
    ({ reply }) =>
      reply(
        join('', [
          'Чтобы добавить трату, введите число, ',
          'либо воспользуйтесь помощью, отправив команду /help',
        ]),
      ),
  ) as (context: TelegrafContext) => void

  return handleMessage(context)
}

export default base
