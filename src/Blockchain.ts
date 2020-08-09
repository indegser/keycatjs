const eos = [
  'eos',
  'eos-jungle',
  'telos',
  'telos-testnet',
  'eos-kylin',
  'worbli',
  'telos',
  'meetone',
  'bos',
  'wax',
] as const
const klaytn = ['klaytn', 'klaytn-baobab'] as const
const ethereum = ['homestead', 'ropsten', 'kovan', 'rinkeby'] as const

const Blockchain = {
  eos,
  klaytn,
  ethereum,
}

export const appendPlugin = blockchain => {
  const keys = Object.keys(Blockchain)

  for (const key of keys) {
    const nameSet = Blockchain[key]
    if (nameSet.find(n => n === blockchain.name)) {
      return {
        ...blockchain,
        plugin: key,
      }
    }
  }

  const { plugin } = blockchain
  if (!plugin) {
    throw new Error(`Cannot find 'plugin' property for your custom 'blockchain' configuration.`)
  }

  return blockchain
}

export default Blockchain
