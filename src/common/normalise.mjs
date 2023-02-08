import {
  homedir
} from 'node:os'

import {
  resolve
} from 'node:path'

export default (p) => resolve(p.trim().replace(/^~/, homedir()))
