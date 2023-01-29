#!/usr/bin/env node

import 'dotenv/config'

import debug from 'debug'

import {
  Command
} from 'commander'

import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageAuthor from './src/common/get-package-author.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'

import P from './src/package.mjs'
import D from './src/depsrc.mjs'
import E from './src/eslintrc.mjs'

const log = debug('housekeeping')

log('`housekeeping` is awake')

const commander = new Command()

async function app () {
  const PACKAGE = await getPackage('.')

  const name = getPackageName(PACKAGE)

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      AUTHOR = getPackageAuthor(PACKAGE),
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .option('-a, --author [author]', 'Package author')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR
  } = commander.opts()

  await P(dir, author)

  await D(dir, author)

  await E(dir)
}

export default app()
