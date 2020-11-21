import { Category, DataElement } from '.'

export interface Purchase {
  id: number
  category: Category
  sum: number
  addedAt: number
  addedBy: number
  dailyData?: DataElement
}
