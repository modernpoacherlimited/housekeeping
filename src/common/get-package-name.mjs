import debug from 'debug'

const log = debug('housekeeping/common/get-package-name')

log('`housekeeping` is awake')

export default function getPackageName (PACKAGE = {}) {
  log('getPackageName')

  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}
