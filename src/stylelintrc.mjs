import debug from 'debug'

import {
  resolve,
  dirname
} from 'node:path'

import isBoolean from './common/is-boolean.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/stylelintrc')
const info = debug('housekeeping/stylelintrc:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.stylelintrc`,
    `${directory}/.stylelintrc.json`,
    `${directory}/**/.stylelintrc`,
    `${directory}/**/.stylelintrc.json`,
    `!${directory}/node_modules/.stylelintrc`,
    `!${directory}/node_modules/.stylelintrc.json`,
    `!${directory}/node_modules/**/.stylelintrc`,
    `!${directory}/node_modules/**/.stylelintrc.json`,
    `!${directory}/**/node_modules/.stylelintrc`,
    `!${directory}/**/node_modules/.stylelintrc.json`,
    `!${directory}/**/node_modules/**/.stylelintrc`,
    `!${directory}/**/node_modules/**/.stylelintrc.json`
  ]
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(filePath)

    const {
      extends: doesExtend,
      plugins,
      rules,
      overrides,
      customSyntax,
      defaultSeverity,
      configurationComment,
      ignoreDisables,
      ignoreFiles,
      allowEmptyInput,
      cache,
      fix,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(plugins ? { plugins } : {}),
      ...(rules ? { rules } : {}),
      ...(overrides ? { overrides } : {}),
      ...(customSyntax ? { customSyntax } : {}),
      ...(defaultSeverity ? { defaultSeverity } : {}),
      ...(configurationComment ? { configurationComment } : {}),
      ...(isBoolean(ignoreDisables) ? { ignoreDisables } : {}),
      ...(ignoreFiles ? { ignoreFiles } : {}),
      ...(isBoolean(allowEmptyInput) ? { allowEmptyInput } : {}),
      ...(isBoolean(cache) ? { cache } : {}),
      ...(isBoolean(fix) ? { fix } : {}),
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
