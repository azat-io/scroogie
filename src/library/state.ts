/* eslint-disable fp/no-this */
/* eslint-disable fp/no-mutation */

import {
  ADD_CATEGORY,
  BASE,
  REMOVE_CATEGORY,
  REMOVE_COST,
  SET_BUDGET_SUM,
  SET_COST_SUM,
} from '../constants'

export type Status =
  | typeof ADD_CATEGORY
  | typeof BASE
  | typeof REMOVE_CATEGORY
  | typeof REMOVE_COST
  | typeof SET_BUDGET_SUM
  | typeof SET_COST_SUM

export interface State {
  getCache: () => any
  setCache: (a: any) => void
  getStatus: () => Status
  setStatus: (a: Status) => void
  cache: any
  status: Status
}

const state: State = {
  getCache() {
    return this.cache
  },
  setCache(cache) {
    this.cache = cache
  },
  getStatus() {
    return this.status
  },
  setStatus(status) {
    this.status = status
  },
  status: BASE,
  cache: null,
}

export default state
