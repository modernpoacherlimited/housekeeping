import debug from 'debug'

import getFile from './get-file.mjs'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-package` is awake')

export default async function getPackage (directory = '.') {
  log('getPackage')

  return (
    getFile(`${directory}/package.json`)
  )
}
