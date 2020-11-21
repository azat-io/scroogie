import { getRepository } from 'typeorm'
import { Category } from '../entities'

const categoryRepository = () => getRepository(Category)

export default categoryRepository
