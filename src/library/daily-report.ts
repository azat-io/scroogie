import { andThen, compose } from 'ramda'

import { getReport } from '../api'
import { sendPhotoToEveryone } from './helpers'

const dailyReport = compose(andThen(sendPhotoToEveryone), getReport)

export default dailyReport
