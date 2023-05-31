import debug from 'debug'

import getFilePathList from './get-file-path-list.mjs'

const log = debug('housekeeping/common/get-packages')

log('`housekeeping` is awake')

export default function getPackages (directory = '.') {
  log('getPackages')

  return (
    getFilePathList([`${directory}/package.json`, `${directory}/*/package.json`])
  )
}
