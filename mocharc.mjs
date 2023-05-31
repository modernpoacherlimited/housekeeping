#!/usr/bin/env node

import debug from 'debug'

import M from './src/mocharc.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await M(DIR)
}

export default app()
