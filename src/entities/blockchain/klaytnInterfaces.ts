import { CustomConfig } from './keycatInterfaces'

export interface KlaytnConfig {
  rpcUrls: string[];
}

export interface CustomKlaytnConfig extends CustomConfig, KlaytnConfig { }
