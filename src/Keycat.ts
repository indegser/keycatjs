import * as qs from 'query-string';
import { KeycatConfig } from './keycat-interfaces';
import { Deferred } from './Deferred';

interface ISigninResult {
  accountName: string;
  permission: string;
  publicKey: string;
}

class Keycat {
  private config: KeycatConfig;
  private popup: Window;
  public keycatOrigin: string;

  constructor(config: KeycatConfig) {
    this.config = config;
    this.keycatOrigin = this.getKeycatOrigin();
  }

  private getKeycatOrigin = () => {
    const defaultOrigin = `https://{{NAME}}.keycat.co`;
    const {
      blockchain: { name, network },
      __keycatOrigin,
    } = this.config;

    if (__keycatOrigin) {
      return __keycatOrigin;
    }
    const subdomain = [name, network]
      .filter(Boolean)
      .join('-')
      .replace('-main', '');
    return defaultOrigin.replace('{{NAME}}', subdomain);
  };

  private buildSrc = (path: string, params = {}) => {
    const client = location.origin;
    const { blockchain } = this.config;

    const search = qs.stringify({
      ...params,
      blockchain: JSON.stringify(blockchain),
      client,
    });
    return this.keycatOrigin + path + `?${search}`;
  };

  private open = <T>(src) => {
    const deferred = new Deferred<T>();
    this.openPopup(src, deferred);

    window.onmessage = ({ data }) => {
      const { ____keycat } = data;
      if (!____keycat) return;
      this.respond(data, deferred);
    };

    return deferred.promise;
  };

  private openPopup = (src, deferred) => {
    if (this.popup) {
      this.popup.close();
    }

    const w = 420;
    const h = 720;
    var y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    var x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    const opts = [`width=${w}`, `height=${h}`, `top=${y}`, `left=${x}`].join(',');
    this.popup = window.open(src, 'Keycat', opts);

    const timer = setInterval(() => {
      if (this.popup.closed) {
        clearInterval(timer);
        deferred.reject('CLOSED');
      }
    }, 500);
  };

  private respond = (data: any, promise: Deferred<any>) => {
    const { type, payload } = data;
    if (type === 'close') {
      promise.reject('CLOSED');
    } else {
      const { data, error } = payload;
      if (error) promise.reject(error);
      if (data) promise.resolve(data);
    }

    this.popup.close();
    // this.closeIframe()
  };

  encode = (data) => {
    return encodeURIComponent(btoa(JSON.stringify(data)));
  }

  signin = () => {
    return this.open<ISigninResult>(this.buildSrc('/signin'));
  };

  sign = (account, transaction) => {
    return this.open<any>(this.buildSrc('/sign', {
      transaction: this.encode(transaction),
      account,
    }));
  }

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)));
    const src = this.buildSrc('/transact', { p, account });
    return this.open<any>(src);
  };
}

export default Keycat;
