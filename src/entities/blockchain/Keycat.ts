
import * as qs from 'query-string'
import { Deferred } from '../../Deferred'
import { SigninResult } from './keycatInterfaces'
import { chainNameType } from '../types'

abstract class AbstractKeycat {
  protected abstract getNodes(): Array<string>;
  abstract getKeycatOrigin(): string;
}

class Keycat extends AbstractKeycat {
  private popup: Window;
  private currentAccount: string;
  private __keycatOrigin: string;
  public keycatOrigin: string;

  private chainName: chainNameType;
  private displayName: string;

  constructor(chainName: chainNameType, displayName) {
    super()
    this.chainName = chainName
    this.displayName = displayName
    this.keycatOrigin = this.getKeycatOrigin()
  }

  protected getNodes() {
    return [];
  }

  getKeycatOrigin = () => {
    return `https://${this.displayName}.keycat.co`
  }

  private buildSrc = (path: string, args = []) => {
    const client = location.origin

    const search = qs.stringify({
      blockchain: this.chainName,
      nodes: JSON.stringify(this.getNodes()),
      client,
      account: this.currentAccount,
      payload: this.encode(args),
    })

    return this.keycatOrigin + path + `?${search}`
  }

  private open = <T>(src) => {
    const deferred = new Deferred<T>()
    this.openPopup(src, deferred)

    window.onmessage = ({ data }) => {
      const { ____keycat } = data
      if (!____keycat) return
      this.respond(data, deferred)
    }

    return deferred.promise
  }

  private openPopup = (src, deferred) => {
    if (this.popup) {
      this.popup.close()
    }

    const w = 420
    const h = 720
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2
    const opts = [`width=${w}`, `height=${h}`, `top=${y}`, `left=${x}`].join(',')
    this.popup = window.open(src, 'Keycat', opts)

    const timer = setInterval(() => {
      if (this.popup && this.popup.closed) {
        clearInterval(timer)
        deferred.reject('CLOSED')
      }
    }, 500)
  }

  private respond = (response: any, promise: Deferred<any>) => {
    const { type, payload } = response
    if (type === 'close') {
      promise.reject('CLOSED')
    } else {
      const { data, error } = payload
      if (error) promise.reject(error)
      if (data) promise.resolve(data)
    }

    this.popup.close()
    // this.closeIframe()
  }

  private guardAccountAction = methodName => {
    if (!this.currentAccount) {
      throw new Error(`You must chain key like this. keycat.account('...').[${methodName}](...) `)
    }
  }

  private encode = data => {
    return encodeURIComponent(btoa(JSON.stringify(data)))
  }

  public account = (account: string) => {
    this.currentAccount = account
    return this
  }

  public signin = () => {
    return this.open<SigninResult>(this.buildSrc('/signin'))
  }

  public signTransaction = (...args) => {
    this.guardAccountAction('signTransaction')
    return this.open<any>(this.buildSrc('/sign-transaction', args))
  }

  public signArbitraryData = data => {
    this.guardAccountAction('signArbitraryData')
    return this.open<any>(this.buildSrc('/sign-arbitrary-data', data))
  }

  public transact = (...args) => {
    this.guardAccountAction('transact')
    const src = this.buildSrc('/transact', args)
    return this.open<any>(src)
  }
}

export default Keycat

