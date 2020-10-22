import debug from 'debug'

import {
  dirname,
  resolve
} from 'path'

import glob from 'glob-all'

import {
  readFile,
  writeFile
} from 'fs/promises'

import getPackages from './get-packages'

const log = debug('housekeeping:depsrc')

log('`housekeeping:depsrc` is awake')

const transform = (p) => resolve(dirname(p))

function getFileGlob (p) {
  log('getFileGlob')

  return (
    new Promise((resolve, reject) => {
      glob(`${p}/.depsrc`, (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}

async function execute (p) {
  log('execute', p)

  let s = await readFile(p, 'utf8')
  let o = JSON.parse(s)

  const {
    dependencies,
    devDependencies,
    optionalDependencies,
    bundleDependencies,
    peerDependencies,
    ...rest
  } = o

  o = {
    ...(dependencies ? { dependencies } : {}),
    ...(devDependencies ? { devDependencies } : {}),
    ...(optionalDependencies ? { optionalDependencies } : {}),
    ...(bundleDependencies ? { bundleDependencies } : {}),
    ...(peerDependencies ? { peerDependencies } : {}),
    ...rest
  }

  s = JSON.stringify(o, null, 2).concat('\n')
  await writeFile(p, s, 'utf8')
}

async function recurse ([p, ...a]) {
  log('recurse', p)

  const array = await getFileGlob(p)

  await Promise.all(array.map(execute))

  if (a.length) await recurse(a)
}

export default async function app (dir) {
  const array = await getPackages(dir)

  await recurse(array.map(transform))
}
