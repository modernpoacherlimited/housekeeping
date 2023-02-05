import debug from 'debug'

import glob from 'glob-all'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-file-path-list` is awake')

export default function getFilePathList (patterns = './*') {
  log('getFilePathList')

  return (
    new Promise((resolve, reject) => {
      glob(patterns, (e, a) => {
        (!e)
          ? resolve(a)
          : reject(e)
      })
    })
  )
}
