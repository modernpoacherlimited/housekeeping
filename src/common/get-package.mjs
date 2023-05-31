import debug from 'debug'

import getFile from './get-file.mjs'

const log = debug('housekeeping/common/get-package')

log('`housekeeping` is awake')

export default async function getPackage (directory = '.') {
  log('getPackage')

  return (
    getFile(`${directory}/package.json`)
  )
}
