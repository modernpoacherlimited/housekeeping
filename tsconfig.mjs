#!/usr/bin/env node

import debug from 'debug'

import T from './src/tsconfig.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await T(DIR)
}

export default app()
