import debug from 'debug'

import { readFile } from 'fs/promises'

const log = debug('housekeeping:get-package')

log('`housekeeping:get-package` is awake')

export default async function getPackage (filePath) {
  const fileData = await readFile(filePath, 'utf8')

  return JSON.parse(fileData)
}
