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

const log = debug('housekeeping:eslintrc')

log('`housekeeping:eslintrc` is awake')

const transform = (p) => resolve(dirname(p))

function getFileGlob (p) {
  log('getFileGlob')

  return (
    new Promise((resolve, reject) => {
      glob([`${p}/**/.eslintrc`, `!${p}/node_modules/**/.eslintrc`], (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}

async function execute (p) {
  log('execute', p)

  let s = await readFile(p, 'utf8')
  let o = JSON.parse(s)

  const {
    extends: doesExtend,
    env,
    parser,
    parserOptions,
    plugins,
    rules,
    overrides,
    settings,
    ...rest
  } = o

  o = {
    ...(doesExtend ? { extends: doesExtend } : {}),
    ...(env ? { env } : {}),
    ...(parser ? { parser } : {}),
    ...(parserOptions ? { parserOptions } : {}),
    ...(plugins ? { plugins } : {}),
    ...(rules ? { rules } : {}),
    ...(overrides ? { overrides } : {}),
    ...(settings ? { settings } : {}),
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
