
Keycatjs
========

this compact and efficient client library provides access to Keycat service. See below for a list of supported APIs.

Installation
============

```javascript
npm install keycatjs
yarn add keycatjs
```

Usage
=====

```javascript
import Keycat from 'keycat'

const config = {
  network: 'jungle', // or 'main'
  keycatOrigin: 'https://www.keycat.co' // optional.
}

const keycat = new Keycat(config)

// Sign in request
const handleSignin = async () => {
  try {
    const { account } = await keycat.signin()
    // e.g) junglekeycat
  } catch (err) {
    // err is string
  }
}

const handleTransaction = (account) => {
  const payload = {
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      data: {
        from: account,
        to: 'junglekeycat',
        quantity: '0.0001 EOS',
        memo: '',
      },
    }],
  }

  try {
    const result = keycat.transact(account, payload)
    // result is same as eosjs transact response.
  } catch (err) {

  }
}

```

