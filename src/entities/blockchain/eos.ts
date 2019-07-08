import Keycat from './Keycat'
import { EosConfig, CustomEosConfig } from './eosInterfaces'

export class Eos extends Keycat {
  private nodes: Array<string>;

  constructor(nodes: Array<string>, displayName?: string) {
    const chainName = 'eos'
    super(chainName, displayName || chainName)
    this.nodes = nodes
  }

  getNodes() {
    return this.nodes
  }
}

export class EosJungle extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'eos-jungle')
  }
}

export class EosKylin extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'eos-kylin')
  }
}

export class Worbli extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'worbli')
  }
}

export class Bos extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'worbli')
  }
}

export class Telos extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'telos')
  }
}

export class Meetone extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'meetone')
  }
}

export class Wax extends Eos {
  constructor({ nodes }: EosConfig) {
    super(nodes, 'wax')
  }
}

export class EosCustom extends Eos {
  private origin: string;

  constructor({ nodes, origin }: CustomEosConfig) {
    super(nodes, 'eos-custom')
    this.origin = origin
  }

  getKeycatOrigin() {
    return this.origin
  }
}
