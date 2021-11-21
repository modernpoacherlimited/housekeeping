import debug from 'debug'

import { writeFile } from 'fs/promises'

const log = debug('housekeeping:set-package')

log('`housekeeping:set-package` is awake')

export default async function setPackage (filePath, o) {
  const fileData = JSON.stringify(o, null, 2).concat('\n')

  return await writeFile(filePath, fileData, 'utf8')
}
