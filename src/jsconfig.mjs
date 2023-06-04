import debug from 'debug'

import getFilePathList from './common/get-file-path-list.mjs'
import genFilePath from './common/gen-file-path.mjs'
import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const MESSAGE = 'No error message defined'

const log = debug('housekeeping/jsconfig')
const info = debug('housekeeping/jsconfig:info')
const error = debug('housekeeping/jsconfig:error')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/jsconfig.json`,
    `${directory}/*/jsconfig.json`,
    `${directory}/**/*/jsconfig.json`,
    `!${directory}/node_modules/jsconfig.json`,
    `!${directory}/node_modules/*/jsconfig.json`,
    `!${directory}/node_modules/**/*/jsconfig.json`,
    `!${directory}/**/*/node_modules/jsconfig.json`,
    `!${directory}/**/*/node_modules/*/jsconfig.json`,
    `!${directory}/**/*/node_modules/**/*/jsconfig.json`
  ]
}

async function renderFile (p) {
  log('renderFile')

  try {
    info(p)

    const {
      compilerOptions,
      include,
      exclude,
      ...rest
    } = await getFile(p)

    await setFile(p, {
      ...(compilerOptions ? { compilerOptions } : {}),
      ...(include ? { include } : {}),
      ...(exclude ? { exclude } : {}),
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

    const a = await getFilePathList(toPatterns(d))
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
