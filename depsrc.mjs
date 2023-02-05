#!/usr/bin/env node

import debug from 'debug'

import D from './src/depsrc.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await D(DIR)
}

export default app()
