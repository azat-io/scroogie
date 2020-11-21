import { compose, prop, reject, sortBy, toLower } from 'ramda'

import { Category } from '../../typings'

const formatCategoryList = compose(
  sortBy(compose(toLower, prop('name'))) as (
    categories: Category[],
  ) => Category[],
  reject(prop('archived')),
) as (categories: Category[]) => Category[]

export default formatCategoryList
