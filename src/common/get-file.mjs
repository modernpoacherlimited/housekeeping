import debug from 'debug'

import { readFile } from 'fs/promises'

const log = debug('housekeeping/common/get-file')

log('`housekeeping` is awake')

export default async function getFile (filePath) {
  log('getFile')

  const fileData = await readFile(filePath, 'utf8')

  return JSON.parse(fileData)
}
