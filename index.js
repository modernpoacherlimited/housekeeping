#!/usr/bin/env node

require('@babel/register')

require('dotenv/config')

const debug = require('debug')

const psList = require('ps-list')

const { default: P } = require('./src/package')
const { default: D } = require('./src/depsrc')
const { default: E } = require('./src/eslintrc')

const {
  env: {
    DEBUG = 'housekeeping:*'
  }
} = process

debug.enable(DEBUG)

const log = debug('housekeeping')

log('`housekeeping` is awake')

const commander = require('commander')

const PACKAGE = require('./package.json')

const NAME = 'housek'
process.title = NAME

function getPackageName () {
  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}

function getPackageAuthor () {
  const {
    author = 'Jonathan Perry <jonathanperry@modernpoacher.com>'
  } = PACKAGE

  return author
}

function getPackageVersion () {
  const {
    version = '1.0.0'
  } = PACKAGE

  return version
}

async function app () {
  const name = getPackageName()

  /**
   *  Permit only one instance of the application
   */
  try {
    const a = (await psList())
      .filter(({ name }) => name === NAME)

    if (a.length > 1) {
      const {
        pid: PID
      } = process

      const {
        pid
      } = a.find(({ pid }) => pid !== PID)

      const log = debug('housekeeping:process:log')

      log(`Killing application "${name}" in process ${pid}.`)

      process.kill(pid)
    }
  } catch ({ message }) {
    const error = debug('housekeeping:process:error')

    error(message)
    return
  }

  const log = debug('housekeeping:log')

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      REGEXP = '^Jonathan Perry',
      AUTHOR = getPackageAuthor(),
      VERSION = getPackageVersion()
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .option('-a, --author [author]', 'Package author')
    .option('-r, --regexp [regexp]', 'A regular expression with which to match the package author')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR,
    regexp = REGEXP
  } = commander.opts()

  await P(dir, author, regexp)

  await D(dir)

  await E(dir)
}

module.exports = app()
