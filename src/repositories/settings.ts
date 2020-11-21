import { getRepository } from 'typeorm'
import { Settings } from '../entities'

const settingsRepository = () => getRepository(Settings)

export default settingsRepository
