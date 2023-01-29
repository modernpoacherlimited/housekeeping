import debug from 'debug'

import glob from 'glob-all'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-packages` is awake')

export default function getPackages (directory) {
  log('getPackages')

  return (
    new Promise((resolve, reject) => {
      const pattern = `${directory}/*/package.json`

      glob(pattern, (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}
