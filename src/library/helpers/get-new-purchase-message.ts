import { always, both, has, ifElse, is, join } from 'ramda'

import { Category, DataElement } from '../../typings'

import { formatMoney } from '../../utils'

const getNewPurchaseMessage = ({
  category,
  sum,
  dailyData,
}: {
  category: Category | undefined
  sum: number
  dailyData: DataElement | undefined
}): string =>
  join('', [
    `Добавлена покупка категории "${category?.name}" на сумму `,
    `${formatMoney(sum)} \n\n`,
    ifElse(
      both(is(Object), has('dayBudget')),
      data =>
        join('', [
          `Сегодня было потрачено: ${formatMoney(data.dayCost)}\n`,
          `Осталось на день: ${formatMoney(data.dayBalance)}`,
        ]),
      always(''),
    )(dailyData),
  ])

export default getNewPurchaseMessage
