import 'jest'
import { Keycat } from '../index'

test('Test Keycat with static Eos', () => {
  const keycat = new Keycat.Eos(['test'])
  expect(keycat.keycatOrigin).toBe('https://eos.keycat.co')
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
