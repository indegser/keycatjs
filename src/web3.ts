import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WebsocketSubprovider from 'web3-provider-engine/subproviders/websocket'
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet'
import { Keycat } from '.'

const keycatWeb3Provider = (keycat: Keycat) => {
  const engine = new ProviderEngine()

  engine.addProvider(
    new HookedWalletSubprovider({
      async getAccounts(cb) {
        const account = await keycat.signin()
        const accounts = [account.address]
        cb(null, accounts)
        return accounts
      },
      async signMessage(payload, cb) {
        const { data, from } = payload
        const sig = await keycat.account(from).signArbitraryData(data)
        cb(null, sig)
        return sig
      },
      async signTransaction(transaction, cb) {
        if (transaction.gas !== undefined) transaction.gasLimit = transaction.gas
        transaction.value = transaction.value || '0x00'

        const { from, gas, ...txPayload } = transaction

        const hash = await keycat.account(from).signTransaction(txPayload)

        cb(null, hash)
        return hash
      },
    }),
  )

  const { rpcUrl } = keycat.config.blockchain
  const url = new URL(rpcUrl)

  if (url.protocol.indexOf('http') > -1) engine.addProvider(new RpcSubprovider({ rpcUrl }))
  else engine.addProvider(new WebsocketSubprovider({ rpcUrl }))
  engine.start()
  return engine
}

export default keycatWeb3Provider
