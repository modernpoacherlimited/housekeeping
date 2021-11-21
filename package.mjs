import debug from 'debug'

import getPackage from './src/common/get-package.mjs'
import getPackageAuthor from './src/common/get-package-author.mjs'

import P from './src/package.mjs'

async function app () {
  const PACKAGE = await getPackage('./package.json')

  const {
    env: {
      DIR = '..',
      AUTHOR = getPackageAuthor(PACKAGE),
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await P(DIR, AUTHOR)
}

export default app()
