import debug from 'debug'

import { readFile } from 'fs/promises'

const log = debug('housekeeping:common')

log('`housekeeping:common:get-package` is awake')

export default async function getPackage (directory = '.') {
  log('getPackage')

  const fileData = await readFile(`${directory}/package.json`, 'utf8')

  return JSON.parse(fileData)
}
