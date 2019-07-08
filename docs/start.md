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

// Connect to eos main net
const keycat = new Keycat.Eos([
  'https://mainnetnode1.com',
  'https://mainnetnode2.com',
])
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

