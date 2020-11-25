import { Context as TelegrafContext } from 'telegraf'
import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'

import {
  always,
  andThen,
  applySpec,
  compose,
  curry,
  F,
  forEach,
  flip,
  invoker,
  tap,
  toString,
} from 'ramda'

import { getCategories, removeCategory as removeCategoryApi } from '../api'
import bot from '../bot'
import { formatCategoryList, sendMessageToEveryone } from './helpers'
import { Category } from '../typings'

const removeCategory = (context: TelegrafContext) => {
  const showCategories = compose(
    (categories: any) => {
      const menu = new MenuTemplate<TelegrafContext>(
        always('Выберите категорию для удаления:'),
      )
      menu.choose('delete', categories, {
        do: curry(
          (ctx, key) =>
            (compose(
              F,
              invoker(0, 'deleteMessage'),
              tap(
                compose(
                  andThen(
                    compose(
                      sendMessageToEveryone,
                      (category: Category | undefined): string =>
                        `Категория "${category?.name}" была успешно удалена`,
                    ),
                  ),
                  removeCategoryApi,
                  flip(
                    applySpec({
                      id: () => parseInt(key, 10),
                    }),
                  ),
                ),
              ),
            )(ctx) as unknown) as (context: TelegrafContext) => boolean,
        ),
        columns: 1,
        disableChoiceExistsCheck: true,
      })
      const menuMiddleware = new MenuMiddleware<TelegrafContext>(
        '/delete/',
        menu,
      )
      bot.use(menuMiddleware.middleware())
      menuMiddleware.replyToContext(context)
    },
    (categories: Category[]) => {
      const data = new Map()
      forEach(({ id, name }) => {
        data.set(toString(id), name)
      }, categories)
      return data
    },
  )

  const handleMessage = compose(
    andThen(compose(showCategories, formatCategoryList)),
    getCategories,
  ) as (context: TelegrafContext) => void

  return handleMessage(context)
}

export default removeCategory
