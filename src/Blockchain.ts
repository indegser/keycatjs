
const eos = ['telos', 'telos-testnet'] as const

const Blockchain = {
  eos,
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
