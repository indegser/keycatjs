import Keycat from './Keycat'

export class Eos extends Keycat {
  constructor(nodes: string[]) {
    super({
      plugin: 'eos',
      nodes,
    })
  }

  get name() {
    return 'eos'
  }
}

export class EosJungle extends Eos {
  get name() {
    return 'eos-jungle'
  }
}

export class EosKylin extends Eos {
  get name() {
    return 'eos-kylin'
  }
}

export class Worbli extends Eos {
  get name() {
    return 'worbli'
  }
}

export class Bos extends Eos {
  get name() {
    return 'bos'
  }
}

export class Telos extends Eos {
  get name() {
    return 'telos'
  }
}

export class Meetone extends Eos {
  get name() {
    return 'meetone'
  }
}

export class Wax extends Eos {
  get name() {
    return 'wax'
  }
}

export class EosCustom extends Eos {
  constructor(nodes: string[], public origin: string) {
    super(nodes)

    if (origin.includes('keycat.co')) {
      throw new Error('origin property cannot contain keycat.co')
    }
  }

  get name() {
    return 'eos-custom'
  }

  get keycatOrigin() {
    return this.origin
  }
}
