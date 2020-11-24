import { FindOperator } from 'typeorm'

import { purchaseRepository } from '../repositories'
import { Purchase } from '../typings/purchase'

const getPurchases = async (options: {
  where: { addedAt: FindOperator<Date> }
}) => {
  const repository = purchaseRepository()
  const purchases: Purchase[] = await repository.find({
    ...options,
    relations: ['category'],
  })
  return purchases
}

export default getPurchases
