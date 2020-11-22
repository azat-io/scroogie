import { always, has, ifElse, prop } from 'ramda'

import { getSettings } from '.'
import { settingsRepository } from '../repositories'
import { Cost, Settings } from '../typings'

const updateCosts = async (costs: Cost[]) => {
  const repository = settingsRepository()
  const settings = await getSettings()
  const updatedSettings: Settings = {
    ...settings,
    id: 'settings',
    budget: ifElse(has('budget'), prop('budget'), always(0))(settings),
    costs,
  }
  await repository.save(updatedSettings)
  return updatedSettings
}

export default updateCosts
