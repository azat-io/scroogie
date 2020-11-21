import { merge } from 'ramda'

import { categoryRepository } from '../repositories'
import { Category } from '../entities'

const addCategory = async (data: { name: string }) => {
  const repository = categoryRepository()
  const category = merge(new Category(), data)

  await repository.save(category)
  return category
}

export default addCategory
