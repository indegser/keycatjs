---
description: >-
  Keycat currently supports EOS and Klaytn. If you are interested in Keycat and
  seeking for integration with your blockchain, contact to indegser@eosdaq.com
---

# Configuration

## Common

```typescript
import { Keycat } from 'keycat'

const eosMainnetKeycat = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'main',
    },
})

const customNodesKeycat = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'custom',
        nodes: [
            'http://mylocalnodeos.com',
            'http://localhost:18888',
        ],
    },
})
```

**KeycatJS** is designed for flexible usage like setting custom nodes, using non-https endpoints and testing in localhost. 

Initializing `Keycat` requires `blockchain` property.

```typescript
interface BlockchainConfig {
    name: 'eos'|'klaytn';
    network: string;
    nodes?: string[];
}

interface KeycatConfig {
    blockchain: BlockchainConfig;
    __keycatOrigin: string;
}
```



## EOS

## Klaytn



