import debug from 'debug'

import isBoolean from './common/is-boolean.mjs'
import getFilePathList from './common/get-file-path-list.mjs'
import genFilePath from './common/gen-file-path.mjs'
import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const MESSAGE = 'No error message defined'

const log = debug('housekeeping/stylelintrc')
const info = debug('housekeeping/stylelintrc:info')
const error = debug('housekeeping/stylelintrc:error')

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

async function renderFile (p) {
  log('renderFile')

  try {
    info(p)

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
    } = await getFile(p)

    await setFile(p, {
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
  } catch ({
    message = MESSAGE
  }) {
    error(message)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const d = transform(directory)
  try {
    info(d)

    const a = await getFilePathList(toPatterns(transform(directory)))
    for (const p of genFilePath(a)) await renderFile(p)
  } catch ({
    message = MESSAGE
  }) {
    error(message)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = transform(directory)
  try {
    info(d)

    const a = await getPackages(d)
    for (const p of genFilePath(a)) await handlePackageDirectory(toDirectory(p))
  } catch ({
    message = MESSAGE
  }) {
    error(message)
  }
}
