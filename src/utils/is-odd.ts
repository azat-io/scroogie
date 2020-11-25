import { __, equals, compose, modulo } from 'ramda'

const isOdd = compose(equals(1), modulo(__, 2))

export default isOdd
