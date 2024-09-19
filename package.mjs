#!/usr/bin/env node

import debug from 'debug'

import {
  Command
} from 'commander'

import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageAuthor from './src/common/get-package-author.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'
import normalise from './src/common/normalise.mjs'

import P from './src/package.mjs'

const {
  env: {
    DEBUG = 'housekeeping*'
  }
} = process

if (DEBUG) debug.enable(DEBUG)

const log = debug('housekeeping')

log('`housekeeping` is awake')

const commander = new Command()

async function app () {
  const PACKAGE = await getPackage()

  const name = getPackageName(PACKAGE)

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      AUTHOR = getPackageAuthor(PACKAGE),
      REGEXP = '^Jonathan Perry',
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .option('-a, --author [author]', 'Package author')
    .option('-r, --regexp [regexp]', 'Package author Regular Expression')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR,
    regexp = REGEXP
  } = commander.opts()

  const directory = normalise(dir)

  log({
    directory,
    author,
    regexp
  })

  await P(directory, author, regexp)
}

export default app()
