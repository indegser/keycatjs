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
  public isAcceptable({ name, nodes, urlOrigin }) {
    console.log('about to validate isAcceptable', name, nodes, urlOrigin)
    if (!Blockchain.eos.find(preset => name === preset)) return false

    if (!nodes) {
      throwValidationError({ name, property: 'nodes', blockchain: 'eos' })
    }
    console.log('EosValidator true')
    return true
  }
}

const validators = {
  eos: EosValidator,
}

export default validators
