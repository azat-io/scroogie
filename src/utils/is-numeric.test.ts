import { isNumeric } from '.'

test('Test isNumeric helper', () => {
  expect(isNumeric('1000')).toBe(true)
  expect(isNumeric('100.75')).toBe(true)
  expect(isNumeric('Test 100')).toBe(false)
  expect(isNumeric('200 Test')).toBe(false)
  expect(isNumeric('')).toBe(false)
})
