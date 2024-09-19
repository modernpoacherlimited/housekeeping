import debug from 'debug'

import getFilePaths from './get-file-paths.mjs'

const log = debug('housekeeping/common/get-packages')

log('`housekeeping` is awake')

export default function getPackages (directory = '.') {
  log('getPackages')

  return (
    getFilePaths([
      `${directory}/package.json`,
      `${directory}/*/package.json`
    ])
  )
}
