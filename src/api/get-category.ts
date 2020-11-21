import { categoryRepository } from '../repositories'
import { Category } from '../typings'

const getCategory = async (data: { id: number }) => {
  const repository = categoryRepository()
  const category: Category | undefined = await repository.findOne(data)
  return category
}

export default getCategory
