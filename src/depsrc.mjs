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

const log = debug('housekeeping/depsrc')
const info = debug('housekeeping/depsrc:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.depsrc`,
    `${directory}/.depsrc.json`,
    `${directory}/**/.depsrc`,
    `${directory}/**/.depsrc.json`,
    `!${directory}/node_modules/.depsrc`,
    `!${directory}/node_modules/.depsrc.json`,
    `!${directory}/node_modules/**/.depsrc`,
    `!${directory}/node_modules/**/.depsrc.json`,
    `!${directory}/**/node_modules/.depsrc`,
    `!${directory}/**/node_modules/.depsrc.json`,
    `!${directory}/**/node_modules/**/.depsrc`,
    `!${directory}/**/node_modules/**/.depsrc.json`
  ]
}

async function renderFile (filePath, AUTHOR) {
  log('renderFile')

  try {
    info(filePath)

    const {
      author,
      dependencies,
      devDependencies,
      optionalDependencies,
      bundleDependencies,
      peerDependencies,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
      ...(author ? { author } : { author: AUTHOR }),
      ...(dependencies ? { dependencies } : {}),
      ...(devDependencies ? { devDependencies } : {}),
      ...(optionalDependencies ? { optionalDependencies } : {}),
      ...(bundleDependencies ? { bundleDependencies } : {}),
      ...(peerDependencies ? { peerDependencies } : {}),
      ...rest
    })
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory, author) {
  log('handlePackageDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPatterns(d))
    for (const filePath of genFilePath(a)) await renderFile(filePath, author)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory, author) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath), author)
  } catch (e) {
    handleError(e)
  }
}
