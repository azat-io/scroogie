import {
  assoc,
  compose,
  concat,
  defaultTo,
  has,
  ifElse,
  isNil,
  merge,
  not,
  when,
} from 'ramda'

import { Settings } from '../entities'
import { settingsRepository } from '../repositories'
import { Settings as SettingsType } from '../typings'

import { getSettings } from '.'

const setSettings = async ({
  budget,
  cost,
}: {
  budget?: number
  cost?: { name: string; sum: number }
}) => {
  const repository = settingsRepository()
  const settings = await getSettings()
  const notNil = compose(not, isNil)

  const hundleQuery = ifElse(
    isNil,
    async () => {
      const newSettings = merge(new Settings(), { budget, costs: [cost] })
      await repository.save(newSettings)
      return newSettings
    },
    async (settingsData: SettingsType) => {
      const newData = compose(
        when(
          () => notNil(cost),
          ifElse(
            () => compose(has('costs'))(defaultTo({}, settingsData)),
            assoc('costs', concat(settingsData.costs, [cost])),
            assoc('costs', [cost]),
          ),
        ),
        when(() => notNil(budget), assoc('budget', budget)),
      )({})
      const updatedSettings = { ...settings, ...newData }

      await repository.save(updatedSettings)
      return updatedSettings
    },
  )

  return hundleQuery(settings)
}

export default setSettings
