import 'jest'
import { Keycat } from '../index'

test('Test Keycat with static Telos', () => {
  const keycat = new Keycat.Telos(['test'])
  expect(keycat.keycatOrigin).toBe('https://wallet.telos.net')
})

test('Test Keycat with static TelosTestnet', () => {
  const keycat = new Keycat.TelosTestnet(['test'])
  expect(keycat.keycatOrigin).toBe('http://localhost:3030')
})
