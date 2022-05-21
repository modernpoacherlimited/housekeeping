import debug from 'debug'

import {
  resolve
} from 'path'

import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:package')

log('`housekeeping:package` is awake')

const transform = (v) => resolve(v) // constrain to one arg

async function execute (p, AUTHOR, REGEXP) {
  log('execute')

  try {
    info(p)

    const {
      name,
      version,
      description,
      keywords,
      private: isPrivate,
      main,
      type,
      types,
      author,
      contributors,
      license,
      engines,
      repository,
      homepage,
      bugs,
      scripts,
      bin,
      dependencies,
      devDependencies,
      peerDependencies,
      imports,
      exports,
      _moduleAliases,
      husky,
      ...rest
    } = await getFile(p)

    await setFile(p, {
      ...(name ? { name } : {}),
      ...(version ? { version } : {}),
      ...(description ? { description } : {}),
      ...(keywords ? { keywords } : {}),
      ...(isPrivate ? { private: isPrivate } : {}),
      ...(main ? { main } : {}),
      ...(type ? { type } : {}),
      ...(types ? { types } : {}),
      ...(author ? (typeof author === 'string' && REGEXP.test(author)) ? { author: AUTHOR } : { author } : {}),
      ...(contributors ? { contributors } : {}),
      ...(license ? { license } : {}),
      ...(engines ? { engines } : {}),
      ...(repository ? { repository } : {}),
      ...(homepage ? { homepage } : {}),
      ...(bugs ? { bugs } : {}),
      ...(scripts ? { scripts } : {}),
      ...(bin ? { bin } : {}),
      ...(dependencies ? { dependencies } : {}),
      ...(devDependencies ? { devDependencies } : {}),
      ...(peerDependencies ? { peerDependencies } : {}),
      ...rest,
      ...(imports ? { imports } : {}),
      ...(exports ? { exports } : {}),
      ...(_moduleAliases ? { _moduleAliases } : {}),
      ...(husky ? { husky } : {})
    })
  } catch ({ message = 'No error message defined' }) {
    log(message)
  }
}

async function iterate ([p, ...a], author, regExp) {
  log('iterate')

  if (p) await execute(p, author, regExp)

  if (a.length) await iterate(a, author, regExp)
}

export default async function app (directory, author, pattern) {
  log('app')

  const array = await getPackages(transform(directory))

  await iterate(array.map(transform), author, new RegExp(pattern))
}
