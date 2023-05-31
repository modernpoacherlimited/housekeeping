import debug from 'debug'

import getFilePathList from './common/get-file-path-list.mjs'
import genFilePath from './common/gen-file-path.mjs'
import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const MESSAGE = 'No error message defined'

const log = debug('housekeeping')
const info = debug('housekeeping/mocharc')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.mocharc`,
    `${directory}/.mocharc.json`,
    `${directory}/*/.mocharc`,
    `${directory}/*/.mocharc.json`,
    `${directory}/**/*/.mocharc`,
    `${directory}/**/*/.mocharc.json`,
    `!${directory}/node_modules/.mocharc`,
    `!${directory}/node_modules/.mocharc.json`,
    `!${directory}/node_modules/*/.mocharc`,
    `!${directory}/node_modules/*/.mocharc.json`,
    `!${directory}/node_modules/**/*/.mocharc`,
    `!${directory}/node_modules/**/*/.mocharc.json`,
    `!${directory}/**/*/node_modules/.mocharc`,
    `!${directory}/**/*/node_modules/.mocharc.json`,
    `!${directory}/**/*/node_modules/*/.mocharc`,
    `!${directory}/**/*/node_modules/*/.mocharc.json`,
    `!${directory}/**/*/node_modules/**/*/.mocharc`,
    `!${directory}/**/*/node_modules/**/*/.mocharc.json`
  ]
}

async function renderFile (p) {
  log('renderFile')

  try {
    info(p)

    const {
      'node-option': nodeOption,
      extension,
      ...rest
    } = await getFile(p)

    await setFile(p, {
      ...(nodeOption ? { 'node-option': nodeOption } : {}),
      ...(extension ? { extension } : {}),
      ...rest
    })
  } catch ({
    message = MESSAGE
  }) {
    log(message)
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
    log(message)
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
    log(message)
  }
}
