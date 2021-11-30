---
description: >-
  Keycat currently supports EOS and Klaytn. If you are interested in Keycat and
  seeking for integration with your blockchain, contact to indegser@eosdaq.com
---

# Configuration

## EOS

```typescript
import { Keycat } from 'keycat'

const nodes = [
    'https://example.com',
    'https://example1.com',
]

const eosMainnetKeycat = new Keycat.Eos(nodes)
const eosJunglenetKeycat = new Keycat.EosJungle(nodes)

// SIDECHAIN examples.
const worbliKeycat = new Keycat.Worbli([
    'https://api.worbli.io',
    'worbli.eoscafeblock.com',
])

const bosKeycat = new Keycat.Bos([
    'https://api.bossweden.org',
    'https://hapi.bos.eosrio.io',
])
```

**Keycatjs** is designed for flexible usage while providing full Typescript support. All you have to provide is list of nodes for each networks.

### EOS Network Presets

| Name | Keycat URL |
| :--- | :--------- ||
| Telos        | telos.keycat.co         |
| TelosTestnet | telos-testnet.keycat.co |         |
