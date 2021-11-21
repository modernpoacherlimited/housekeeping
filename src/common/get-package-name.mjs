import debug from 'debug'

const log = debug('housekeeping:get-package-name')

export default function getPackageName (PACKAGE) {
  log('getPackageName')

  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}
