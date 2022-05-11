import debug from 'debug'

import glob from 'glob-all'

import transform from './common/transform.mjs'

import getPackage from './common/get-package.mjs'
import setPackage from './common/set-package.mjs'
import getPackages from './common/get-packages.mjs'

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

async function execute (p) {
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
    } = await getPackage(p)

    await setPackage(p, {
      ...(author ? { author } : { author: 'Modern Poacher Limited <modernpoacher@modernpoacher.com>' }),
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

async function recurse ([p, ...a]) {
  log('recurse')

  const array = await getFileGlob(p)

  await Promise.all(array.map(execute))

  if (a.length) await recurse(a)
}

export default async function app (directory) {
  log('app')

  const array = await getPackages(directory)

  await recurse(array.map(transform))
}
