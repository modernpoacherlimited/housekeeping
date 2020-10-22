import debug from 'debug'

import glob from 'glob-all'

const log = debug('housekeeping:get-packages')

log('`housekeeping:get-packages` is awake')

export default function getPackages (dir) {
  log('getPackages')

  return (
    new Promise((resolve, reject) => {
      glob(`${dir}/*/package.json`, (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}
