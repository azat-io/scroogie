import { addIndex, reduce } from 'ramda'

const reduceIndexed = addIndex(reduce) as <T, TResult, R extends T[]>(
  iterator: (acc: TResult, elem: T, key: number, list: R) => TResult,
  acc: TResult,
  list: R,
) => TResult

export default reduceIndexed
