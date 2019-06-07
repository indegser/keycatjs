import 'jest'
import Keycat from '../index'

test('Test keycat origin generation', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'eos',
      network: 'jungle',
    }
  })

  expect(keycat.keycatOrigin).toBe('https://eos-jungle.keycat.co')
})

test('Test keycat with custom nodes', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'eos',
      network: 'main',
      nodes: ['hello']
    }
  })

  expect(keycat.keycatOrigin).toBe('https://eos.keycat.co')
})

test('Keycat with custom origin', () => {
  const a = 'http://localhost:3000'

  const keycat = new Keycat({
    __keycatOrigin: a,
    blockchain: {
      name: 'eos',
      network: 'custom',
      nodes: ['hello'],
    }
  })

  expect(keycat.keycatOrigin).toBe('http://localhost:3000')
})

test('Keycat with custom blockchain', () => {
  const keycat = new Keycat({
    blockchain: {
      name: 'eos',
      network: 'custom',
      nodes: ['hello'],
    }
  })

  expect(keycat.keycatOrigin).toBe('https://eos-custom.keycat.co')
})