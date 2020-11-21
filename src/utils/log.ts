import chalk from 'chalk'

import { compose, curry, is, join, length, repeat, subtract, when } from 'ramda'

const getSpaceByTitle = when(
  is(String),
  compose(join(''), repeat(' '), subtract(15), length),
)

const log = curry((title: string, value: string): any => {
  // eslint-disable-next-line no-console
  console.log(
    chalk.bold.green(title),
    getSpaceByTitle(title),
    chalk.bold(value),
  )
  return value
})

export default log
