import {
  andThen,
  applySpec,
  compose,
  identity,
  is,
  prop,
  tap,
  when,
} from 'ramda'

import { addCategory as addCategoryApi, addPurchase } from '../api'
import { BASE } from '../constants'
import {
  getMessageFromContext,
  getNewPurchaseMessage,
  sendMessageToEveryone,
} from './helpers'
import { Category } from '../typings'
import state from './state'

const addCategory = compose(
  tap(
    compose(
      when(
        is(String),
        compose(
          andThen(
            compose(
              andThen(
                compose(
                  tap(() => {
                    state.setStatus(BASE)
                  }),
                  sendMessageToEveryone,
                  getNewPurchaseMessage,
                ),
              ),
              addPurchase,
              applySpec({
                addedBy: () => state.getCache().addedBy,
                categoryId: prop('id'),
                sum: () => state.getCache().sum,
              }) as (
                category: Category,
              ) => { addedBy: number; categoryId: number; sum: number },
            ),
          ),
          addCategoryApi,
          applySpec({
            name: identity,
          }) as (s: string) => Category,
        ),
      ),
      getMessageFromContext,
    ),
  ),
)

export default addCategory
