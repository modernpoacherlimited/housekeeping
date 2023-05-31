#!/usr/bin/env node

import debug from 'debug'

import J from './src/jsconfig.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await J(DIR)
}

export default app()
