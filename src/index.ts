import * as qs from 'query-string'

class Deferred<T> {
  resolve = null
  reject = null
  promise = new Promise<T>((res, rej) => {
    this.resolve = res
    this.reject = rej
  })
}

interface KeycatConfig {
  network?: 'jungle'|'main',
  keycatOrigin?: string,
  nodes?: string[],
}

interface ISigninResult {
  account: string,
}

class Keycat {
  private config: KeycatConfig;
  private popup: Window
  private defaultOrigin = `https://www.keycat.co`;

  constructor(config: KeycatConfig) {
    this.config = config
  }

  private buildSrc = (path, params = {}) => {
    const client = location.origin
    const { keycatOrigin, ...config } = this.config
    const origin = keycatOrigin || this.defaultOrigin
    const search = qs.stringify({ ...params, ...config, client })
    return origin + path + `?${search}`
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

    this.popup = window.open(
      src,
      'Keycat',
      'height=480,width=400'
    )

    const timer = setInterval(() => {
      if (this.popup.closed) {
        clearInterval(timer)
        deferred.reject('CLOSED')
      }
    }, 500)
  }

  private respond = (data: any, promise: Deferred<any>) => {
    const { type, payload } = data
    if (type === 'close') {
      promise.reject('CLOSED');
    } else {
      const { data, error } = payload;
      if (error) promise.reject(error);
      if (data) promise.resolve(data);
    }

    this.popup.close()
    // this.closeIframe()
  }

  signin = () => {
    return this.open<ISigninResult>(this.buildSrc(''));
  }

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)))
    const src = this.buildSrc('/transact', { p, account })
    return this.open<any>(src);
  }
}

export default Keycat;
