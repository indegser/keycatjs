import { Keycat } from '..'

export class KeycatEos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos',
        nodes,
      },
    })
  }
}

export class KeycatEosJungle extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos-jungle',
        nodes,
      },
    })
  }
}

export class KeycatEosKylin extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'eos-kylin',
        nodes,
      },
    })
  }
}

export class KeycatBos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'bos',
        nodes,
      },
    })
  }
}

export class KeycatMeetone extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'meetone',
        nodes,
      },
    })
  }
}

export class KeycatTelos extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'telos',
        nodes,
      },
    })
  }
}

export class KeycatWorbli extends Keycat {
  constructor(nodes) {
    super({
      blockchain: {
        name: 'worbli',
        nodes,
      },
    })
  }
}
