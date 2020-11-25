import { formatPercent } from '.'

test('Test formatMoney helper', () => {
  expect(formatPercent(1)).toBe('100.00 %')
  expect(formatPercent(0.75125)).toBe('75.13 %')
  expect(formatPercent(1.46)).toBe('146.00 %')
})
