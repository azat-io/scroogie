import { isOdd } from '.'

test('Test isNumeric helper', () => {
  expect(isOdd(1)).toBe(true)
  expect(isOdd(2)).toBe(false)
  expect(isOdd(3)).toBe(true)
})
