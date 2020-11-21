import { getRepository } from 'typeorm'
import { Purchase } from '../entities'

const purchaseRepository = () => getRepository(Purchase)

export default purchaseRepository
