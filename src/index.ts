import { Deferred } from './Deferred'
import Blockchain, { appendPlugin } from './Blockchain'
import validators, { IBlockchainValidator } from './Validator'
import { ISigninResponse, WindowUX } from './Types'
import { openWindow, makeWindowUrl } from './utils/window'
import keycatWeb3Provider from './web3'

type IEos =
  | {
      name: typeof Blockchain.eos[number]
      nodes: string[]
      plugin?: never
    }
  | {
      name: string
      plugin: 'eos'
      nodes: string[]
    }

type IKlaytn =
  | {
      plugin?: never
      name: typeof Blockchain.klaytn[number]
      rpcUrl: string
    }
  | {
      plugin: 'klaytn'
      name: string
      rpcUrl: string
    }

interface IEthereum {
  plugin: 'ethereum'
  rpcUrl?: string
  provider?: typeof Blockchain.ethereum[number] | string
  name: typeof Blockchain.ethereum[number]
}

type TBlockchain = IEos | IKlaytn | IEthereum

interface IKeycatConfig {
  account?: string
  ux?: keyof typeof WindowUX
  blockchain: TBlockchain
  __keycatOrigin?: string
}

class Keycat {
  private win: Window
  private _account: string

  constructor(public config: IKeycatConfig) {
    this.validateBlockchain(config.blockchain)
    this._account = config.account
  }

  public static Eos: typeof KeycatEos
  public static EosCustom: typeof KeycatEosCustom
  public static EosJungle: typeof KeycatEosJungle
  public static EosKylin: typeof KeycatEosKylin
  public static Meetone: typeof KeycatMeetone
  public static Worbli: typeof KeycatWorbli
  public static Telos: typeof KeycatTelos
  public static Bos: typeof KeycatBos

  private validateBlockchain(blockchain: TBlockchain) {
    const { name: chainName, plugin } = blockchain

    const names = Object.keys(validators)
    for (const name of names) {
      const validator: IBlockchainValidator = new validators[name]()
      const isValid = validator.isAcceptable(blockchain)
      if (isValid) return
    }

    // Using custom name which is not in the list of preset. Check plugin exists.
    if (!chainName || !plugin) {
      throw new Error(`Unknown configuration for 'blockchain' property.`)
    }

    // tslint:disable-next-line
    console.warn(
      `You are using custom name. We hope you understand what you are doing. We recommend using a preset name.`,
    )
  }

  public web3(Web3) {
    const provider = keycatWeb3Provider(this)
    const web3 = new Web3(provider)
    return web3
  }

  private spawnWindow(url: string, secure: boolean = false): Promise<any> {
    if (secure && !this._account) {
      throw new Error(`You must chain "account" method first. e.g) keycat.account(accountName).transact(...) `)
    }

    const deferred = new Deferred()
    this.win = openWindow(url, this.config.ux)

    const timer = setInterval(() => {
      if (!this.win || this.win.closed) {
        clearInterval(timer)
        // deferred.reject('Closed')
      }
    }, 500)

    window.onmessage = ({ data }) => {
      const { ____keycat } = data
      if (!____keycat) return

      this.sendResponse(data, deferred)
    }

    return deferred.promise
  }

  private sendResponse(message, deferred: Deferred<any>) {
    const { type, payload } = message
    if (type === 'close') {
      deferred.reject('closed')
    } else {
      const { data, error } = payload
      if (error) deferred.reject(error)
      if (data) deferred.resolve(data)
    }

    this.win && this.win.close()
    this.win = null
  }

  private makeUrlData(args?: any[]) {
    return {
      blockchain: appendPlugin(this.config.blockchain),
      account: this._account,
      args: encodeURIComponent(btoa(JSON.stringify(args))),
    }
  }

  get keycatOrigin(): string {
    const {
      __keycatOrigin,
      blockchain: { name },
    } = this.config

    try {
      const url = new URL(__keycatOrigin || name)
      return url.origin
    } catch (err) {
      if (err.message.includes('Invalid URL')) {
        return `https://${name}.keycat.co`
      }
      throw err
    }
  }

  public account(accountName: string) {
    this._account = accountName
    return this
  }

  public signin(): Promise<ISigninResponse> {
    const url = makeWindowUrl(this.keycatOrigin, '/signin', this.makeUrlData())
    return this.spawnWindow(url)
  }

  public transact(...args): Promise<any> {
    const url = makeWindowUrl(this.keycatOrigin, '/transact', this.makeUrlData(args))
    return this.spawnWindow(url, true)
  }

  public signArbitraryData(data): Promise<any> {
    const url = makeWindowUrl(this.keycatOrigin, '/sign-arbitrary-data', this.makeUrlData([data]))
    return this.spawnWindow(url, true)
  }

  public signTransaction(...args): Promise<any> {
    const url = makeWindowUrl(this.keycatOrigin, '/sign-transaction', this.makeUrlData(args))
    return this.spawnWindow(url, true)
  }

  public sign = this.signTransaction
}

class KeycatEos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos',
        nodes,
      },
    })
  }
}

class KeycatEosJungle extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos-jungle',
        nodes,
      },
    })
  }
}

class KeycatEosKylin extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos-kylin',
        nodes,
      },
    })
  }
}

class KeycatBos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'bos',
        nodes,
      },
    })
  }
}
class KeycatMeetone extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'meetone',
        nodes,
      },
    })
  }
}
class KeycatTelos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'telos',
        nodes,
      },
    })
  }
}

class KeycatWorbli extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'worbli',
        nodes,
      },
    })
  }
}

class KeycatEosCustom extends Keycat {
  constructor(nodes, origin) {
    super({
      blockchain: {
        name: origin,
        plugin: 'eos',
        nodes,
      },
    })
  }
}

Keycat.Bos = KeycatBos
Keycat.EosKylin = KeycatEosKylin
Keycat.EosJungle = KeycatEosJungle
Keycat.Eos = KeycatEos
Keycat.Telos = KeycatTelos
Keycat.Worbli = KeycatWorbli
Keycat.Meetone = KeycatMeetone
Keycat.EosCustom = KeycatEosCustom

export { Keycat }
