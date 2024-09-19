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
import isBoolean from './common/is-boolean.mjs'

const log = debug('housekeeping/babelrc')
const info = debug('housekeeping/babelrc:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.babelrc`,
    `${directory}/.babelrc.json`,
    `${directory}/**/.babelrc`,
    `${directory}/**/.babelrc.json`,
    `!${directory}/node_modules/.babelrc`,
    `!${directory}/node_modules/.babelrc.json`,
    `!${directory}/node_modules/**/.babelrc`,
    `!${directory}/node_modules/**/.babelrc.json`,
    `!${directory}/**/node_modules/.babelrc`,
    `!${directory}/**/node_modules/.babelrc.json`,
    `!${directory}/**/node_modules/**/.babelrc`,
    `!${directory}/**/node_modules/**/.babelrc.json`
  ]
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(filePath)

    const {
      root,
      rootMode,
      compact,
      comments,
      presets,
      plugins,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
      ...(root ? { root } : {}),
      ...(rootMode ? { rootMode } : {}),
      ...(isBoolean(compact) ? { compact } : {}),
      ...(isBoolean(comments) ? { comments } : {}),
      ...(presets ? { presets } : {}),
      ...(plugins ? { plugins } : {}),
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
