import * as eos from './entities/blockchain/eos'
import * as klaytn from './entities/blockchain/klaytn'

const Keycat = {
  ...eos,
  ...klaytn,
}

export { Keycat }
