import debug from 'debug'

const log = debug('housekeeping:common')

log('`housekeeping:common:gen-file-path` is awake')

export default function * genFilePath (filePathList) {
  log('genFilePath')

  while (filePathList.length) {
    yield filePathList.shift()
  }
}
