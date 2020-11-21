import { Between } from 'typeorm'

import {
  endOfMonth,
  eachDayOfInterval,
  format,
  getDaysInMonth,
  isSameDay,
  startOfMonth,
} from 'date-fns/fp'
import {
  __,
  add,
  always,
  append,
  applySpec,
  compose,
  divide,
  ifElse,
  last,
  map,
  prop,
  propOr,
  reduce,
  subtract,
} from 'ramda'

import { getPurchases, getSettings } from '.'
import { Cost, DataElement, Purchase } from '../typings'

const getData = async () => {
  const currentDate = new Date()
  const daysInMonth: number = getDaysInMonth(currentDate)
  const start: Date = startOfMonth(currentDate)
  const end: Date = endOfMonth(currentDate)
  const listOfDays = eachDayOfInterval({
    start,
    end,
  })
  const BetweenDates = Between(start, end)
  const purchases: Purchase[] = await getPurchases({
    where: {
      addedAt: BetweenDates,
    },
  })
  const settings = await getSettings()
  const budget: number = propOr(0, 'budget', settings)
  const costs: Cost[] = propOr([], 'costs', settings)
  const cleanBudget = reduce(
    (result: number, cost) => subtract(result, propOr(0, 'sum', cost)),
    budget,
    costs,
  )
  const data = reduce(
    (accumulator: DataElement[], currentDay: Date): DataElement[] =>
      append(
        applySpec({
          date: format('dd.MM.yyyy'),
          dayCost: (day: Date) =>
            reduce(
              (result, purchase) =>
                ifElse(
                  compose(isSameDay(day), prop('addedAt')),
                  compose(add(result), prop('sum')),
                  always(result),
                )(purchase),
              0,
              purchases,
            ),
          dayBudget: (): number =>
            compose(
              subtract(__, propOr(0, 'dayCost', last(accumulator))) as (
                sum: number,
              ) => number,
              add(propOr(0, 'dayBudget', last(accumulator))),
              divide(__, daysInMonth),
            )(cleanBudget),
          isToday: isSameDay(currentDate),
        })(currentDay),
        accumulator,
      ),
    [],
    listOfDays,
  )
  return map(
    element => ({
      ...element,
      dayBalance: subtract(element.dayBudget, element.dayCost),
    }),
    data,
  )
}

export default getData
