export type Cost = {
  name: string
  sum: number
}

export interface Settings {
  id: number
  budget: number
  costs: Cost[]
}
