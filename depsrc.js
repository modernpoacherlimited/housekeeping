require('@babel/register')

const debug = require('debug')

const { default: app } = require('./src/depsrc')

const {
  env: {
    DEBUG = 'housekeeping:depsrc'
  }
} = process

debug.enable(DEBUG)

module.exports = app()
