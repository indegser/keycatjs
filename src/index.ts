import * as eos from './entities/blockchain/eos'
import { Deferred } from './Deferred'
import * as qs from 'query-string'
import { ISigninResult } from './entities/blockchain/keycatInterfaces'
// import * as klaytn from './entities/blockchain/klaytn'

const Keycat = {
  ...eos,
  // ...klaytn,
}

interface IAccount {
  accountName: string
  permission: string
  publicKey: string
}

enum UX {
  popup,
  page,
}

enum Eos {
  eos,
  eosJungle,
  eosKylin,
  worbli,
  telos,
  bos,
  meetone,
}

enum Klaytn {
  klaytn,
  klaytnBaobab,
}

interface IEos {
  name: keyof typeof Eos
  plugin: 'eos'
  nodes: string[]
}

interface IKlaytn {
  name: keyof typeof Klaytn
  plugin: 'klaytn'
  rpcUrl: string
}

interface IKeycatConfig {
  ux?: keyof typeof UX
  blockchain: IEos | IKlaytn
}

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function _keycat(config: IKeycatConfig) {
  let account: string = null
  let deferred: Deferred<any> = null
  let win: Window = null
  let timer: number = null

  const getWinOptions = () => {
    if (config.ux === 'page') {
      return '_blank'
    }

    const w = 480
    const h = 720
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2
    return [`width=${w}`, `height=${h}`, `top=${y}`, `left=${x}`].join(',')
  }

  const respond = message => {
    const { type, payload } = message

    if (type === 'close') {
      deferred.reject('CLOSED')
    } else {
      const { data, error } = payload
      if (error) deferred.reject(error)
      if (data) deferred.resolve(data)
    }

    if (win) {
      win.close()
    }
  }

  const watchWinClose = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }

    timer = setInterval(() => {
      if (win && win.closed) {
        clearInterval(timer)
        deferred.reject('CLOSED')
      }
    }, 500)
  }

  const encode = data => {
    return encodeURIComponent(btoa(JSON.stringify(data)))
  }

  const makeSrc = (path, args = []) => {
    const client = location.origin
    const params = {
      blockchain: JSON.stringify(config.blockchain),
      client,
      account,
      payload: encode(args),
    }

    const search = qs.stringify(
      Object.keys(params).reduce((res, key) => {
        if (params[key]) {
          res[key] = params[key]
        }
        return res
      }, {}),
    )

    return [`https://${camelCaseToDash(config.blockchain.name)}.keycat.co`, path, `?${search}`].join('')
  }

  // PRIVATE METHODS
  const spawn = src => {
    // If previous window is still open. Do the cleanings here.
    if (win || deferred) {
      win.close()
      win = null
      deferred = null
    }

    deferred = new Deferred()
    if (config.ux === 'page') {
      win = window.open(src, '_blank')
    } else {
      win = window.open(src, 'Keycat', getWinOptions())
    }

    window.onmessage = ({ data }) => {
      const { ____keycat } = data
      if (!____keycat || !deferred) return
      respond(data)
    }

    watchWinClose()
    return deferred.promise
  }

  const guardAccountAction = () => {
    if (!account) {
      throw new Error(`You must chain "account" method first. e.g) keycat.account(accountName).transact(...) `)
    }
  }

  // PUBLIC METHODS
  return {
    signin: (): Promise<ISigninResult> => spawn(makeSrc('/signin')),
    account(accountName: string) {
      // Didn't used arrow function for "this" to work
      account = accountName
      return this
    },
    signTransaction: (...args) => {
      guardAccountAction()
      return spawn(makeSrc('/sign-transaction', args))
    },
    signArbitraryData: data => {
      guardAccountAction()
      return spawn(makeSrc('/sign-transaction', data))
    },
    transact: (...args) => {
      guardAccountAction()
      return spawn(makeSrc('/transact', args))
    },
  }
}

export { Keycat, _keycat }
