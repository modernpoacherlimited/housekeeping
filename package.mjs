import debug from 'debug'

import getPackage from './src/common/get-package.mjs'
import getPackageAuthor from './src/common/get-package-author.mjs'

import P from './src/package.mjs'

async function app () {
  const PACKAGE = await getPackage()

  const {
    env: {
      DIR = '..',
      AUTHOR = getPackageAuthor(PACKAGE),
      REGEXP = '^Jonathan Perry',
      DEBUG = 'housekeeping'
    }
  } = process

  debug.enable(DEBUG)

  return await P(DIR, AUTHOR, REGEXP)
}

export default app()
