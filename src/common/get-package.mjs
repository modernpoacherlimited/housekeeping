import debug from 'debug'

import fromFile from './from-file.mjs'

const log = debug('housekeeping/common/get-package')

log('`housekeeping` is awake')

export default async function getPackage (directory = '.') {
  log('getPackage')

  return await fromFile(`${directory}/package.json`)
}
