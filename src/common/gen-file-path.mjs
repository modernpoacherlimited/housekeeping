import debug from 'debug'

const log = debug('housekeeping/common/gen-file-path')

log('`housekeeping` is awake')

export default function * genFilePath (filePathList) {
  log('genFilePath')

  while (filePathList.length) {
    yield filePathList.shift()
  }
}
