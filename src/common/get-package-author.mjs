import debug from 'debug'

const log = debug('housekeeping:get-package-author')

log('`housekeeping:get-package-author` is awake')

export default function getPackageAuthor (PACKAGE = {}) {
  log('getPackageAuthor')

  const {
    author = 'Jonathan Perry <jonathanperry@sequencemedia.net>'
  } = PACKAGE

  return author
}
