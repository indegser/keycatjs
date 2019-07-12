import Blockchain from './Blockchain'

export interface IBlockchainValidator {
  isAcceptable(b: any): boolean
}

const throwValidationError = ({ name, property, blockchain }) => {
  throw new Error(
    `Property '${property}' in 'blockchain' is required. This error occurred because '${name}' should follow initialization rules of '${blockchain}' configuration.`,
  )
}

class EosValidator implements IBlockchainValidator {
  public isAcceptable({ name, nodes }) {
    if (!Blockchain.eos.find(preset => name === preset)) return false

    if (!nodes) {
      throwValidationError({ name, property: 'nodes', blockchain: 'eos' })
    }

    return true
  }
}

class KlaytnValidator implements IBlockchainValidator {
  public isAcceptable({ name, rpcUrl }) {
    if (!Blockchain.klaytn.find(preset => name === preset)) return false
    if (!rpcUrl) {
      throwValidationError({
        name,
        property: 'rpcUrl',
        blockchain: 'klaytn',
      })
    }

    return true
  }
}

const validators = {
  eos: EosValidator,
  klaytn: KlaytnValidator,
}

export default validators
