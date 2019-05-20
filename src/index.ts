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
  private config: PeekabooConfig;
  private iframeId = 'peekaboo'
  // private iframeOrigin = `http://localhost:3000`;
  private iframeOrigin = `https://eos-peekaboo.netlify.com`;

  constructor(config: PeekabooConfig) {
    this.config = config;
  }

  private buildIframeSrc = (path, params = {}) => {
    const client = location.origin
    const search = qs.stringify({ ...params, client })
    return this.iframeOrigin + path + `?${search}`
  }

  private open = (src) => {
    const deferred = new Deferred()
    this.renderIframe(src)

    window.onmessage = ({ data, origin }) => {
      if (origin !== this.iframeOrigin) return

      const { __peekaboo } = data
      if (!__peekaboo) return
      this.respond(data, deferred)
    }

    return deferred.promise
  }

  private closeIframe = () => {
    const prevIframe = document.getElementById(this.iframeId)
    if (prevIframe) {
      document.body.removeChild(prevIframe)
    }
  }

  private renderIframe = (src) => {
    this.closeIframe()

    const iframe = document.createElement('iframe')
    iframe.id = this.iframeId
    iframe.src = src

    iframe.style.zIndex = '9999'
    iframe.style.top = '0'
    iframe.style.right = '0'
    iframe.style.width = '400px'
    iframe.style.height = '267px'
    iframe.style.position = 'fixed'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)
  }

  private respond = (data: any, promise: Deferred) => {
    const { type, payload } = data
  
    if (type === 'close') {
      promise.reject('CLOSED');
    } else {
      const { data, error } = payload;
      if (error) promise.reject(error);
      if (data) promise.resolve(data);
    }
    this.closeIframe()
  }

  signin = () => {
    return this.open(this.buildIframeSrc(''));
  }

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)))
    const src = this.buildIframeSrc('/transact', { p, account })
    return this.open(src);
  }
}

export default Peekaboo;
