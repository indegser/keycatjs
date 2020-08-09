import 'jest'
import { Keycat } from '../index'

test('Test Keycat with static Eos', () => {
  const keycat = new Keycat.Eos(['test'])
  expect(keycat.keycatOrigin).toBe('https://eos.keycat.co')
})

test('Test Keycat with static Telos', () => {
  const keycat = new Keycat.Telos(['test'])
  expect(keycat.keycatOrigin).toBe('https://telos.keycat.co')
})

test('Test Keycat with static TelosTestnet', () => {
  const keycat = new Keycat.TelosTestnet(['test'])
  expect(keycat.keycatOrigin).toBe('https://telos-testnet.keycat.co')
})

test('Keycat with proper config', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'eos',
      nodes: [],
    },
  })

  expect(keycat.keycatOrigin).toBe('https://eos.keycat.co')
})

test('Keycat with proper config', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'telos',
      nodes: [],
    },
  })

  expect(keycat.keycatOrigin).toBe('https://telos.keycat.co')
})

test('Keycat with proper config', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'telos-testnet',
      nodes: [],
    },
  })

  expect(keycat.keycatOrigin).toBe('https://telos-testnet.keycat.co')
})

test('Keycat with custom name in full url', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'https://test.keycat.co',
      plugin: 'klaytn',
      rpcUrl: 'http://test.com',
    },
  })

  expect(keycat.keycatOrigin).toBe('https://test.keycat.co')
})

test('Keycat with custom name in shortname', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'test',
      plugin: 'klaytn',
      rpcUrl: 'http://test.com',
    },
  })

  expect(keycat.keycatOrigin).toBe('https://test.keycat.co')
})
