import debug from 'debug'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-package-version` is awake')

export default function getPackageVersion (PACKAGE = {}) {
  log('getPackageVersion')

  const {
    version = '1.0.0'
  } = PACKAGE

  return version
}
