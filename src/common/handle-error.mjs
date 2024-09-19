import debug from 'debug'

const MESSAGE = 'No error message defined'

const error = debug('housekeeping:error')

export default function handleError ({
  message = MESSAGE
}) {
  error(message)
}
