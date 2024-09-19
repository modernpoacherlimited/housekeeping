import debug from 'debug'

import {
  writeFile
} from 'fs/promises'

const log = debug('housekeeping/common/to-file')

log('`housekeeping` is awake')

export default async function toFile (filePath, o) {
  log('toFile')

  const fileData = JSON.stringify(o, null, 2).concat('\n')

  return await writeFile(filePath, fileData, 'utf8')
}
