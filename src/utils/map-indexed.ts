import { addIndex, map } from 'ramda'

const reduceIndexed = addIndex(map) as <T, U>(
  iterator: (elem: T, key: number, list: T[]) => U,
) => (list: ReadonlyArray<T>) => U[]

export default reduceIndexed
