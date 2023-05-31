import debug from 'debug'

const log = debug('housekeeping/common/get-package-version')

log('`housekeeping` is awake')

export default function getPackageVersion (PACKAGE = {}) {
  log('getPackageVersion')

  const {
    version = '1.0.0'
  } = PACKAGE

  return version
}
