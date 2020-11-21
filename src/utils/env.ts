import { __, prop } from 'ramda'

const env = prop(__, process.env)

export default env
