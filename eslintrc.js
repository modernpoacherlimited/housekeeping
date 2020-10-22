require('@babel/register')

const debug = require('debug')

const { default: app } = require('./src/eslintrc')

const {
  env: {
    DEBUG = 'housekeeping:eslintrc'
  }
} = process

debug.enable(DEBUG)

module.exports = app()
