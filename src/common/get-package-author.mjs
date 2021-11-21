import debug from 'debug'

const log = debug('housekeeping:get-package-author')

export default function getPackageAuthor (PACKAGE) {
  log('getPackageAuthor')

  const {
    author = 'Jonathan Perry <jonathanperry@sequencemedia.net>'
  } = PACKAGE

  return author
}
