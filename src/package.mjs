import debug from 'debug'

import genFilePath from './common/gen-file-path.mjs'
import getFile from './common/get-file.mjs'
import setFile from './common/set-file.mjs'
import getPackages from './common/get-packages.mjs'
import transform from './common/transform.mjs'

const MESSAGE = 'No error message defined'

const log = debug('housekeeping')
const info = debug('housekeeping:package')

log('`housekeeping:package` is awake')

async function renderFile (p, AUTHOR, REGEXP) {
  log('renderFile')

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
  } catch ({
    message = MESSAGE
  }) {
    log(message)
  }
}

export default async function handleDirectory (directory, author, regExp) {
  log('handleDirectory')

  const d = transform(directory)
  try {
    info(d)

    const a = await getPackages(d)
    for (const p of genFilePath(a)) await renderFile(p, author, new RegExp(regExp))
  } catch ({
    message = MESSAGE
  }) {
    log(message)
  }
}
