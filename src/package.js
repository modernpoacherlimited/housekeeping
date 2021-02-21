import debug from 'debug'

import {
  resolve
} from 'path'

import {
  readFile,
  writeFile
} from 'fs/promises'

import getPackages from './common/get-packages'

const log = debug('housekeeping:package')

log('`housekeeping:package` is awake')

const transform = (v) => resolve(v) // constrain to one arg

async function execute (p, AUTHOR, REGEXP, d) {
  log('execute')

  let s = await readFile(p, 'utf8')
  let o = JSON.parse(s)

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
    _moduleAliases,
    husky,
    ...rest
  } = o

  o = {
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
    ...(_moduleAliases ? { _moduleAliases } : {}),
    ...(husky ? { husky } : {})
  }

  s = JSON.stringify(o, null, 2).concat('\n')
  await writeFile(p, s, 'utf8')
}

export default async function app (directory, author, regExp) {
  log('app')

  const array = await getPackages(transform(directory))

  await Promise.all(array.map(transform).map((p) => execute(p, author, new RegExp(regExp), directory)))
}
