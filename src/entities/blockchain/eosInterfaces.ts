import { CustomConfig } from './keycatInterfaces'

export interface EosConfig {
  nodes: string[];
}

export interface CustomEosConfig extends CustomConfig, EosConfig { }