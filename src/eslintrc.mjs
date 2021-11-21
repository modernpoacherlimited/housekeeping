import debug from 'debug'

import glob from 'glob-all'

import transform from './common/transform.mjs'

import getPackage from './common/get-package.mjs'
import setPackage from './common/set-package.mjs'
import getPackages from './common/get-packages.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:eslintrc')

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
    info(p)

    const {
      root,
      extends: doesExtend,
      env,
      parser,
      parserOptions,
      plugins,
      rules,
      overrides,
      settings,
      ...rest
    } = await getPackage(p)

    await setPackage(p, {
      ...(root ? { root } : {}),
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(env ? { env } : {}),
      ...(parser ? { parser } : {}),
      ...(parserOptions ? { parserOptions } : {}),
      ...(plugins ? { plugins } : {}),
      ...(rules ? { rules } : {}),
      ...(overrides ? { overrides } : {}),
      ...(settings ? { settings } : {}),
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
