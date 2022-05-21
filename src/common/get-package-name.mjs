import debug from 'debug'

const log = debug('housekeeping:get-package-name')

log('`housekeeping:get-package-name` is awake')

export default function getPackageName (PACKAGE = {}) {
  log('getPackageName')

  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}
