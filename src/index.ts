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
  private popup: Window
  private origin = `http://localhost:3000`;
  // private iframeOrigin = `https://eos-peekaboo.netlify.com`;

  constructor(config: PeekabooConfig) {
    this.config = config;
  }

  private buildSrc = (path, params = {}) => {
    const client = location.origin
    const search = qs.stringify({ ...params, client })
    return this.origin + path + `?${search}`
  }

  private open = (src) => {
    const deferred = new Deferred()
    this.openPopup(src)
  
    window.onmessage = ({ data, origin }) => {
      if (origin !== this.origin) return

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

  private openPopup = (src) => {
    if (this.popup) {
      this.popup.close()
    }

    this.popup = window.open(
      src,
      'Peekaboo',
      'height=480,width=400'
    )
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
    iframe.style.maxWidth = '100vw'
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

    this.popup.close()
  }

  signin = () => {
    return this.open(this.buildSrc(''));
  }

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)))
    const src = this.buildSrc('/transact', { p, account })
    return this.open(src);
  }
}

export default Peekaboo;
