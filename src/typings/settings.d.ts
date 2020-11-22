export type Cost = {
  name: string
  sum: number
}

export interface Settings {
  id: 'settings'
  budget: number
  costs: Cost[]
}
