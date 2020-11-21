import { categoryRepository } from '../repositories'
import { Category } from '../typings'

import getCategory from './get-category'

const removeCategory = async (data: { id: number }) => {
  const repository = categoryRepository()
  const category: Category | undefined = await getCategory(data)
  await repository.save({ ...category, archived: true })
  return category
}

export default removeCategory
