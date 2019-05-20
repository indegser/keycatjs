import * as qs from 'query-string'

class Deferred {
  resolve = null
  reject = null
  promise = new Promise((res, rej) => {
    this.resolve = res
    this.reject = rej
  })
}

interface PeekabooConfig {
  network: 'jungle'|'main',
}

class Peekaboo {
  private popup: Window;
  private config: PeekabooConfig;
  private iframeId = 'peekaboo'
  private iframeOrigin = `https://eos-peekaboo.eosdaq.com`;

  constructor(config: PeekabooConfig) {
    this.config = config;
  }

  private buildIframeSrc = (path, params = {}) => {
    const client = location.origin
    const search = qs.stringify({ ...params, client })
    return this.iframeOrigin + client + path + `?${search}`
  }

  private open = (src) => {
    const deferred = new Deferred()
    this.renderIframe(src)

    window.onmessage = ({ data, origin }) => {
      if (origin !== this.iframeOrigin) return
      this.respond(data, deferred)
    }

    return deferred.promise
  }

  private renderIframe = (src) => {
    const prevIframe = document.getElementById(this.iframeId)
    if (prevIframe) {
      document.removeChild(prevIframe)
    }

    const iframe = document.createElement('iframe')
    iframe.id = this.iframeId
    iframe.src = src
    document.body.appendChild(iframe)
  }

  private respond = (data: any, promise: Deferred) => {
    const { type, payload } = data
  
    if (type === 'closed') {
      promise.reject(type);
    } else {
      const { data, error } = payload;
      if (error) promise.reject(error);
      if (data) promise.resolve(data);
    }
  }

  signin = () => {
    return this.open('/signin');
  }

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)))
    const src = this.buildIframeSrc('/transact', { p, account })
    return this.open(src);
  }
}

export default Peekaboo;
