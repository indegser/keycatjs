---
description: >-
  Keycat currently supports EOS and Klaytn. If you are interested in Keycat and
  seeking for integration with your blockchain, contact to indegser@eosdaq.com
---

# Configuration

## EOS

```typescript
import { Keycat } from 'keycat'

const eosMainnetKeycat = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'main',
    },
})

const eosJunglenetKeycat = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'jungle',
    },
})

// If you are running your own Mainnet node,
// and would like to use if instead of pre-defined nodes.
// Pass nodes(all node should be using protocol 'https')
const eosMainnetKeycatWithCustomNodes = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'main',
        nodes: [
            'https://some-mainnetnode.com',
        ],
    },
})

// If you are running your own keycat(by cloning keycat repository)
// And you have to use your local nodeos for development.
const customNodesKeycat = new Keycat({
    blockchain: {
        name: 'eos',
        network: 'custom',
        nodes: [
            'http://mylocalnodeos.com',
            'http://localhost:18888',
        ],
    },
    __keycatOrigin: 'http://localhost:3030',
})

```

**KeycatJS** is designed for flexible usage like setting custom nodes, using non-https endpoints and testing in localhost.

Initializing `Keycat` requires `blockchain` property.

```typescript
interface BlockchainConfig {
    name: 'eos';
    network: 'main'|'jungle'|'custom';
    nodes?: string[]; // optional in main/jungle network. Keycat will use pre-defined nodes for those networks.
}

interface KeycatConfig {
    blockchain: BlockchainConfig;
    __keycatOrigin?: string; // optional.
}
```



