// import Keycat from './Keycat'

// abstract class AKlaytn extends Keycat {
//   abstract get defaultRpcUrl(): string
// }

// export class Klaytn extends AKlaytn {
//   constructor(private rpcUrl: string) {
//     super()
//   }

//   get name() {
//     return 'klaytn'
//   }

//   get blockchain() {
//     return {
//       rpcUrl: this.rpcUrl || this.defaultRpcUrl,
//     }
//   }

//   get defaultRpcUrl() {
//     return 'https://api.cypress.klaytn.net:8651'
//   }
// }

// export class KlaytnBaobab extends Klaytn {
//   get name() {
//     return 'klaytn-baobab'
//   }

//   get defaultRpcUrl() {
//     return 'https://api.baobab.klaytn.net:8651'
//   }
// }
