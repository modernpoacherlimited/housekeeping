import debug from 'debug'

import glob from 'glob-all'

const log = debug('housekeeping/common/get-file-paths')

log('`housekeeping` is awake')

function dedupe (array, value) {
  if (!array.includes(value)) array.push(value)
  return array
}

export default function getFilePaths (patterns = './*') {
  log('getFilePaths')

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
