import debug from 'debug'

import {
  resolve,
  dirname
} from 'node:path'

import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/mocharc')
const info = debug('housekeeping/mocharc:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.mocharc`,
    `${directory}/.mocharc.json`,
    `${directory}/**/.mocharc`,
    `${directory}/**/.mocharc.json`,
    `!${directory}/node_modules/.mocharc`,
    `!${directory}/node_modules/.mocharc.json`,
    `!${directory}/node_modules/**/.mocharc`,
    `!${directory}/node_modules/**/.mocharc.json`,
    `!${directory}/**/node_modules/.mocharc`,
    `!${directory}/**/node_modules/.mocharc.json`,
    `!${directory}/**/node_modules/**/.mocharc`,
    `!${directory}/**/node_modules/**/.mocharc.json`
  ]
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(filePath)

    const {
      'node-option': nodeOption,
      extension,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
      ...(nodeOption ? { 'node-option': nodeOption } : {}),
      ...(extension ? { extension } : {}),
      ...rest
    })
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPatterns(d))
    for (const filePath of genFilePath(a)) await renderFile(filePath)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
