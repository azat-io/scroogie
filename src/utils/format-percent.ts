import { __, compose, concat, invoker, multiply } from 'ramda'

const formatPercent = compose(
  concat(__, ' %'),
  invoker(1, 'toFixed')(2),
  multiply(100),
)

export default formatPercent
