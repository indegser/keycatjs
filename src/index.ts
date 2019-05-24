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
  network: 'jungle'|'main',
}

interface ISigninResult {
  account: string,
}


class Peekaboo {
  private config: KeycatConfig;
  private popup: Window
  // private origin = `http://172.16.100.28:3000`;
  private origin = `https://keycat.netlify.com`;

  constructor(config: KeycatConfig) {
    this.config = config || {
      network: 'jungle',
    };
  }

  private buildSrc = (path, params = {}) => {
    const client = location.origin
    const search = qs.stringify({ ...params, ...this.config, client })
    return this.origin + path + `?${search}`
  }

  private open = <T>(src) => {
    const deferred = new Deferred<T>()
    this.openPopup(src)
  
    window.onmessage = ({ data, origin }) => {
      if (origin !== this.origin) return

      const { __peekaboo } = data
      if (!__peekaboo) return
      this.respond(data, deferred)
    }

    return deferred.promise
  }

  private openPopup = (src) => {
    if (this.popup) {
      this.popup.close()
    }

    this.popup = window.open(
      src,
      'Keycat',
      'height=480,width=400'
    )
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

export default Peekaboo;
