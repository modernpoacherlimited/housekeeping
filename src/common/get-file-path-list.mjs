import debug from 'debug'

import glob from 'glob-all'

const log = debug('housekeeping/common/get-file-path-list')

log('`housekeeping` is awake')

function dedupe (accumulator, p) {
  return (
    accumulator.includes(p)
      ? accumulator
      : accumulator.concat(p)
  )
}

export default function getFilePathList (patterns = './*') {
  log('getFilePathList')

  return (
    new Promise((resolve, reject) => {
      glob(patterns, (e, a) => {
        (!e)
          ? resolve(a.reduce(dedupe, []))
          : reject(e)
      })
    })
  )
}
