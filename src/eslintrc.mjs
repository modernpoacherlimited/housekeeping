import debug from 'debug'

import glob from 'glob-all'

import toDirectory from './common/to-directory.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

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
    } = await getFile(p)

    await setFile(p, {
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

async function iterate ([p, ...a]) {
  log('iterate')

  if (p) await execute(p)

  if (a.length) await iterate(a)
}

async function recurse ([p, ...a]) {
  log('recurse')

  await iterate(await getFileGlob(p))

  if (a.length) await recurse(a)
}

export default async function app (directory) {
  log('app')

  const array = await getPackages(transform(directory))

  await recurse(array.map(toDirectory))
}
