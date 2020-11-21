import { formatMoney } from '.'

test('Test formatMoney helper', () => {
  expect(formatMoney(1000)).toBe('1,000.00 ₽')
  expect(formatMoney(100.75)).toBe('100.75 ₽')
  expect(formatMoney(10)).toBe('10.00 ₽')
  expect(formatMoney(1000000.5)).toBe('1,000,000.50 ₽')
})
