import { settingsRepository } from '../repositories'

const getSettings = async () => {
  const repository = settingsRepository()
  const settings = await repository.findOne({ id: 1 })

  return settings
}

export default getSettings
