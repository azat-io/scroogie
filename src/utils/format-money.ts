import numbro from 'numbro'

import { __, compose, concat } from 'ramda'

const formatMoney = compose(concat(__, ' ₽'), (value: number | bigint) =>
  numbro(value).format({
    thousandSeparated: true,
    mantissa: 2,
  }),
)

export default formatMoney
