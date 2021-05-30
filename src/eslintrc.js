import debug from 'debug'

import glob from 'glob-all'

import {
  readFile,
  writeFile
} from 'fs/promises'

import transform from './common/transform'

import getPackages from './common/get-packages'

const log = debug('housekeeping:eslintrc')

log('`housekeeping:eslintrc` is awake')

function getFileGlob (p) {
  log('getFileGlob')

  return (
    new Promise((resolve, reject) => {
      const patterns = [
        `${p}/.eslintrc`,
        `${p}/**/*/.eslintrc`,
        `!${p}/node_modules/.eslintrc`,
        `!${p}/node_modules/**/*/.eslintrc`,
        `!${p}/**/*/node_modules/.eslintrc`,
        `!${p}/**/*/node_modules/**/*/.eslintrc`
      ]

      glob(patterns, (e, a) => (!e) ? resolve(a) : reject(e))
    })
  )
}

async function execute (p) {
  log('execute')

  try {
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
