import { categoryRepository } from '../repositories'
import { Category } from '../typings'

const getCategories = async () => {
  const repository = categoryRepository()
  const categories: Category[] = await repository.find()
  return categories
}

export default getCategories
