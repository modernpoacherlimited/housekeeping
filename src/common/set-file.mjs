import debug from 'debug'

import { writeFile } from 'fs/promises'

const log = debug('housekeeping:set-file')

log('`housekeeping:set-file` is awake')

export default async function setFile (filePath, o) {
  log('setFile', filePath)

  const fileData = JSON.stringify(o, null, 2).concat('\n')

  return await writeFile(filePath, fileData, 'utf8')
}
