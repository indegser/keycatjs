import { Deferred } from './Deferred'
import Blockchain, { appendPlugin } from './Blockchain'
import validators, { IBlockchainValidator } from './Validator'
import { ISigninResponse, WindowUX } from './Types'
import { openWindow, makeWindowUrl, fromBinary, toBinary } from './utils/window'

type IEos =
  | {
      name: typeof Blockchain.eos[number]
      nodes: string[]
      plugin?: never
      origin: string
    }
  | {
      name: string
      plugin: 'eos'
      nodes: string[]
      origin: string
    }

type TBlockchain = IEos

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
    console.log('in Keycat constructor and config: ', config)
    this.validateBlockchain(config.blockchain)
    this._account = config.account
  }

  public static Telos: typeof KeycatTelos
  public static TelosTestnet: typeof KeycatTelosTestnet

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

  private spawnWindow(url: string, secure: boolean = false): Promise<any> {
    if (secure && !this._account) {
      throw new Error(`You must chain "account" method first. e.g) keycat.account(accountName).transact(...) `)
    }

    const deferred = new Deferred()
    this.win = openWindow(url, this.config.ux)

    const timer = setInterval(() => {
      if (!this.win || this.win.closed) {
        clearInterval(timer)
        deferred.reject('closed')
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
      args: encodeURIComponent(fromBinary(btoa(toBinary(JSON.stringify(args))))),
    }
  }

  get keycatOrigin(): string {
    console.log('getting keycatOrigin, this.config is: ', this.config)
    const {
      __keycatOrigin,
      blockchain: { name, origin },
    } = this.config

    return origin
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

class KeycatTelos extends Keycat {
  constructor(nodes) {
    console.log('in KeycatTelos constructor')
    super({
      blockchain: {
        name: 'telos',
        origin,
        nodes,
      },
    })
  }
}

class KeycatTelosTestnet extends Keycat {
  constructor(nodes) {
    console.log('in KeycatTelosTestnet constructor')
    super({
      blockchain: {
        name: 'telos-testnet',
        origin,
        nodes,
      },
    })
  }
}

Keycat.Telos = KeycatTelos
Keycat.TelosTestnet = KeycatTelosTestnet

export { Keycat }
