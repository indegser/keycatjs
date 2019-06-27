export interface IEOSConfig {
  name: 'eos'
  nodes?: string[]
  network: 'main' | 'jungle' | 'custom'
}

export interface IKlaytnConfig {
  name: 'klaytn'
  /** Klaytn currently supports only baobab. There's no main */
  network: 'baobab'
  rpcURL?: string
}

export interface IKeycatConfig {
  /**
   * Use this option if your are running [Keycat](https://github.com/EOSDAQ/keycat) on local machine.
   * ```javascript
   * const keycat = new Keycat({
   *  blockchain: {
   *   name: 'eos',
   *   network: 'custom',
   *    nodes: [...],
   *  },
   *  __keycatOrigin: 'http://localhost:3030',
   * })
   * ```
   */
  __keycatOrigin?: string

  /**
   * Blockchain configuration for Keycat.
   * Each blockchain has different **optional** configuration specified by their providers.
   *
   * ```javascript
   * # EOS mainnet
   * new Keycat({
   *   blockchain: {
   *     name: 'eos',
   *     network: 'main',
   *   }
   * })
   *
   * # EOS junglenet
   * new Keycat({
   *   blockchain: {
   *     name: 'eos',
   *     network: 'jungle',
   *   }
   * })
   *
   * # EOS custom network
   * new Keycat({
   *   blockchain: {
   *     name: 'eos',
   *     network: 'custom', // 'custom' means literally 'custom'. Not everything.
   *     nodes: [
   *       'http://localhost:8080',
   *       'http://localhost:8081',
   *       ...
   *     ]
   *   }
   * })
   *
   * # Klaytn baobab network
   * new Keycat({
   *   blockchain: {
   *     name: 'klaytn',
   *     network: 'baobab',
   *   }
   * })
   * ```
   *
   * Each configuration sets keycat url to `${name}-${network}.keycat.co` for keychain to divided according to networks. (for mainnet, it is `${name}.keycat.co`)
   *
   * If you provide custom nodes in eos blockchain, even if network is set to 'main' or 'jungle' it will use nodes you provided.
   *
   */
  blockchain: IEOSConfig | IKlaytnConfig
}
