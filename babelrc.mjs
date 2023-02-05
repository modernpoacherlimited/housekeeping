import debug from 'debug'

import B from './src/babelrc.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await B(DIR)
}

export default app()
