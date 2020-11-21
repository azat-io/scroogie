import { path, split, useWith } from 'ramda'

const dotPath = useWith(path, [split('.')])

export default dotPath
