import debug from 'debug'

import getFilePathList from './common/get-file-path-list.mjs'
import genFilePath from './common/gen-file-path.mjs'
import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:babelrc')

log('`housekeeping:babelrc` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.babelrc`,
    `${directory}/.babelrc.json`,
    `${directory}/**/*/.babelrc`,
    `${directory}/**/*/.babelrc.json`,
    `!${directory}/node_modules/.babelrc`,
    `!${directory}/node_modules/.babelrc.json`,
    `!${directory}/node_modules/**/*/.babelrc`,
    `!${directory}/node_modules/**/*/.babelrc.json`,
    `!${directory}/**/*/node_modules/.babelrc`,
    `!${directory}/**/*/node_modules/.babelrc.json`,
    `!${directory}/**/*/node_modules/**/*/.babelrc`,
    `!${directory}/**/*/node_modules/**/*/.babelrc.json`
  ]
}

async function renderFile (p) {
  log('renderFile')

  try {
    info(p)

    const {
      compact,
      comments,
      presets,
      plugins,
      ...rest
    } = await getFile(p)

    await setFile(p, {
      ...(typeof compact === 'boolean' ? { compact } : {}),
      ...(typeof comments === 'boolean' ? { comments } : {}),
      ...(presets ? { presets } : {}),
      ...(plugins ? { plugins } : {}),
      ...rest
    })
  } catch ({ message = 'No error message defined' }) {
    log(message)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const a = await getFilePathList(toPatterns(transform(directory)))
  for (const p of genFilePath(a)) await renderFile(p)
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const a = await getPackages(transform(directory))
  for (const p of genFilePath(a)) await handlePackageDirectory(toDirectory(p))
}
