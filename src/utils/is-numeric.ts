import { test } from 'ramda'

const isNumeric = test(/^-?\d+\.?\d*$/)

export default isNumeric
