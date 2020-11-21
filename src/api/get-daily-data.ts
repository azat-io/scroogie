import { find, propEq } from 'ramda'

import { getData } from '.'
import { DataElement } from '../typings'

const getDailyData = async (): Promise<DataElement | undefined> => {
  const data: DataElement[] = await getData()
  const dailyData: DataElement | undefined = find(propEq('isToday', true), data)
  return dailyData
}

export default getDailyData
