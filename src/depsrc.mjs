import debug from 'debug'

import getFilePathList from './common/get-file-path-list.mjs'
import genFilePath from './common/gen-file-path.mjs'
import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:depsrc')

log('`housekeeping:depsrc` is awake')

function toPatterns (directory) {
  return [
    `${directory}/.depsrc`,
    `${directory}/.depsrc.json`,
    `${directory}/**/*/.depsrc`,
    `${directory}/**/*/.depsrc.json`,
    `!${directory}/node_modules/.depsrc`,
    `!${directory}/node_modules/.depsrc.json`,
    `!${directory}/node_modules/**/*/.depsrc`,
    `!${directory}/node_modules/**/*/.depsrc.json`,
    `!${directory}/**/*/node_modules/.depsrc`,
    `!${directory}/**/*/node_modules/.depsrc.json`,
    `!${directory}/**/*/node_modules/**/*/.depsrc`,
    `!${directory}/**/*/node_modules/**/*/.depsrc.json`
  ]
}

async function renderFile (p, AUTHOR) {
  log('renderFile')

  try {
    info(p)

    const {
      author,
      dependencies,
      devDependencies,
      optionalDependencies,
      bundleDependencies,
      peerDependencies,
      ...rest
    } = await getFile(p)

    await setFile(p, {
      ...(author ? { author } : { author: AUTHOR }),
      ...(dependencies ? { dependencies } : {}),
      ...(devDependencies ? { devDependencies } : {}),
      ...(optionalDependencies ? { optionalDependencies } : {}),
      ...(bundleDependencies ? { bundleDependencies } : {}),
      ...(peerDependencies ? { peerDependencies } : {}),
      ...rest
    })
  } catch ({ message = 'No error message defined' }) {
    log(message)
  }
}

async function handlePackageDirectory (directory, author) {
  log('handlePackageDirectory')

  const a = await getFilePathList(toPatterns(transform(directory)))
  for (const p of genFilePath(a)) await renderFile(p, author)
}

export default async function handleDirectory (directory, author) {
  log('handleDirectory')

  const a = await getPackages(transform(directory))
  for (const p of genFilePath(a)) await handlePackageDirectory(toDirectory(p), author)
}
