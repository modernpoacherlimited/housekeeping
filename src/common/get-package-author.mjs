import debug from 'debug'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-package-author` is awake')

export default function getPackageAuthor (PACKAGE = {}) {
  log('getPackageAuthor')

  const {
    author = 'Jonathan Perry <jonathanperry@sequencemedia.net>'
  } = PACKAGE

  return author
}
