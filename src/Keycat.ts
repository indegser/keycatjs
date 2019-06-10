import * as qs from 'query-string';
import { KeycatConfig } from './keycat-interfaces';
import { Deferred } from './Deferred';

interface ISigninResult {
  account: string;
}

class Keycat {
  private config: KeycatConfig;
  private popup: Window;
  public keycatOrigin: string;

  constructor(config: KeycatConfig) {
    this.config = config;
    this.keycatOrigin = this.getKeycatOrigin()
  }

  private getKeycatOrigin = () => {
    const defaultOrigin = `https://{{NAME}}.keycat.co`;
    const { blockchain: { name, network }, __keycatOrigin } = this.config;

    if (__keycatOrigin) {
      return __keycatOrigin
    }

    const subdomain = [name, network].join('-').replace('-main', '')
    return defaultOrigin.replace('{{NAME}}', subdomain)
  }

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

    this.popup = window.open(src, 'Keycat', 'height=640,width=420');

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

  signin = () => {
    return this.open<ISigninResult>(this.buildSrc('/signin'));
  };

  transact = (account, tx) => {
    const p = encodeURIComponent(btoa(JSON.stringify(tx)));
    const src = this.buildSrc('/transact', { p, account });
    return this.open<any>(src);
  };
}

export default Keycat;
