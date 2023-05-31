import {
  dirname,
  resolve
} from 'node:path'

export default (p) => resolve(dirname(p))
