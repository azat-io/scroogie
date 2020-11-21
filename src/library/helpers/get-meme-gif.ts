import axios from 'axios'

import { andThen, compose } from 'ramda'

import { GIPHY_API_KEY } from '../../constants'
import { dotPath, env } from '../../utils'

const getMemeGif = (compose(andThen(dotPath('data.data.image_url')), () =>
  axios.get('https://api.giphy.com/v1/gifs/random', {
    params: {
      api_key: env(GIPHY_API_KEY) as string,
      tag: 'duck',
      rating: 'g',
    },
  }),
) as unknown) as () => Promise<string>

export default getMemeGif
