import debug from 'debug'

import E from './src/eslintrc.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await E(DIR)
}

export default app()
