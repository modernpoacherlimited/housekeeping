import debug from 'debug'

const log = debug('housekeeping/common/get-package-author')

log('`housekeeping` is awake')

export default function getPackageAuthor (PACKAGE = {}) {
  log('getPackageAuthor')

  const {
    author = 'Jonathan Perry <jonathanperry@sequencemedia.net>'
  } = PACKAGE

  return author
}
