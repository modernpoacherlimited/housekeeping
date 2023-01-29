import debug from 'debug'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-package-name` is awake')

export default function getPackageName (PACKAGE = {}) {
  log('getPackageName')

  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}
