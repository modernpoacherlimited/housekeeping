import debug from 'debug'

import glob from 'glob-all'

import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:depsrc')

log('`housekeeping:depsrc` is awake')

function getFileGlob (p) {
  log('getFileGlob')

  return (
    new Promise((resolve, reject) => {
      const pattern = [`${p}/.depsrc`, `${p}/.depsrc.json`]

      glob(pattern, (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}

async function execute (p, AUTHOR) {
  log('execute')

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

async function iterate ([p, ...a], author) {
  log('iterate')

  if (p) await execute(p, author)

  if (a.length) await iterate(a, author)
}

async function recurse ([p, ...a], author) {
  log('recurse')

  await iterate(await getFileGlob(p), author)

  if (a.length) await recurse(a, author)
}

export default async function app (directory, author) {
  log('app')

  const array = await getPackages(transform(directory))

  await recurse(array.map(toDirectory), author)
}
