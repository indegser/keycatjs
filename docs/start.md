# Getting Started

## installation

```javascript
npm install keycatjs
yarn add keycatjs
```

## Basic Usage

### Initialization

```javascript
import { Keycat } from 'keycatjs'

// connect to eos main net
const keycat = new Keycat({
  blockchain: 'eos',
  network: 'main', // use 'jungle', if you want to test in jungle net
})
```

### Request Sign-in

```javascript
// e.g) This function is called when user clicks keycat signin button.
async function handleSignin() {
  try {
    const { accountName, permission, publicKey } = await keycat.signin()
  } catch (err) {
    ...
  }
}
```

### Sign in transaction

```javascript
async function handleRequest() {
  // Use account info saved in cookie, localStorage or variable.
  try {
    await keycat
      .account('testaccount1')
      .transact({
        actions: [...]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
  } catch (err) {

  }
}
```

