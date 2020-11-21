import { merge, mergeRight } from 'ramda'

import { purchaseRepository } from '../repositories'
import { Purchase } from '../entities'
import { Category, DataElement } from '../typings'

import { getCategory, getDailyData } from '.'

const addPurchase = async (data: {
  categoryId: number
  sum: number
  addedBy: number
}) => {
  const repository = purchaseRepository()
  const { addedBy, categoryId, sum } = data
  const category: Category | undefined = await getCategory({ id: categoryId })
  const purchase = merge(new Purchase(), { addedBy, category, sum })

  await repository.save(purchase)
  const dailyData: DataElement | undefined = await getDailyData()
  return mergeRight(purchase, { dailyData })
}

export default addPurchase
