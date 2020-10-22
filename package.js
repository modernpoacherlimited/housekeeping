require('@babel/register')

const debug = require('debug')

const { default: app } = require('./src/package')

const {
  env: {
    DEBUG = 'housekeeping:package'
  }
} = process

debug.enable(DEBUG)

module.exports = app()
