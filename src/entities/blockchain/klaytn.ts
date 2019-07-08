import Keycat from './Keycat'
import { KlaytnConfig, CustomKlaytnConfig } from './klaytnInterfaces'

export class Klaytn extends Keycat {
  protected rpcUrls: Array<string>;

  constructor(rpcUrls: Array<string>, displayName?: string) {
    const chainName = 'klaytn'
    super(chainName, displayName || chainName)
    this.rpcUrls = rpcUrls
  }

  getNodes() {
    return this.rpcUrls
  }
}

export class KlaytnBaobab extends Klaytn {
  constructor({ rpcUrls }: KlaytnConfig) {
    super(rpcUrls, 'klaytn-baobab')
  }
}

export class KlaytnCustom extends Klaytn {
  private origin: string;

  constructor({ rpcUrls, origin }: CustomKlaytnConfig) {
    super(rpcUrls, 'klaytn-custom')
    this.origin = origin
  }
}