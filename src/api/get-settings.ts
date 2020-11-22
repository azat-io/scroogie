import { settingsRepository } from '../repositories'

const getSettings = async () => {
  const repository = settingsRepository()
  const settings = await repository.findOne({ id: 'settings' })

  return settings
}

export default getSettings
