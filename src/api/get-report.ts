import puppeteer from 'puppeteer'

import {
  __,
  add,
  always,
  both,
  compose,
  concat,
  divide,
  equals,
  gt,
  ifElse,
  is,
  join,
  length,
  modulo,
  propOr,
  reduce,
  splitEvery,
  subtract,
} from 'ramda'

import { getData, getSettings } from '.'
import { DataElement } from '../typings'
import { formatMoney, reduceIndexed } from '../utils'

const getReport = async () => {
  const isOdd = compose(equals(1), modulo(__, 2))
  const settings = await getSettings()
  const budget: number = propOr(0, 'budget', settings)
  const isNegative = both(is(Number), gt(0))
  const data = await getData()
  const splittedData = splitEvery(Math.ceil(divide(length(data), 2)), data)
  const totalCost: number = reduce(
    (result, { dayCost }) => add(result, dayCost),
    0,
    data,
  )
  const totalBudget: number = subtract(budget, totalCost)

  /* eslint-disable @typescript-eslint/indent */
  // prettier-ignore
  const html = join('', [
    '<link rel="preconnect" href="https://fonts.gstatic.com">',
    '<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">',
    '<style>body { font-family: Verdana, Roboto, sans-serif; margin: 0; }</style>',
    '<div style="display: flex;">',
      reduce((accumulator: string, dataElement: DataElement[]): string => concat(accumulator, join('', [
        '<table style="border: 1px solid #e5e5e5; border-collapse: collapse; border-spacing: 0; margin: 16px 0 16px 16px; width: 500px; color: #333;">',
          '<thead style="background: #333; color: #eee; border: 1px solid #333">',
            '<tr>',
              reduce((result, title) =>
                concat(result, join('', [
                  '<th style="font-size: 12px; font-weight: normal; padding: 16px 18px; text-align: left">',
                    title,
                  '</th>',
                ])),
              '', ['Дата', 'Траты', 'Бюджет на день', 'Сальдо']),
            '</tr>',
          '</thead>',
          '<tbody>',
            reduceIndexed((
              result: string,
              { date, dayCost, dayBudget }: DataElement,
              index: number,
            ): string => concat(
              result,
              join('', [
                '<tr style="font-size: 14px;',
                  'background: #f8f8f8;',
                  'border-top: 1px solid #e5e5e5;',
                  'border-bottom: 1px solid #e5e5e5;',
                  'background: ', ifElse(isOdd, always('#f8f8f8'), always('#fff'))(index),
                '">',
                  '<td style="padding: 16px 12px">',
                    date,
                  '</td>',
                  '<td style="padding: 16px 12px">',
                    formatMoney(dayCost),
                  '</td>',
                  '<td style="padding: 16px 12px; color: ',
                    ifElse(isNegative, always('#b53737'), always('#00ae5d'))(dayBudget),
                  '">',
                    formatMoney(dayBudget),
                  '</td>',
                  '<td style="padding: 16px 12px; color: ',
                    ifElse(isNegative, always('#b53737'), always('#00ae5d'))(subtract(dayBudget, dayCost)),
                  '">',
                    formatMoney(subtract(dayBudget, dayCost)),
                  '</td>',
                '</tr>',
              ]),
            ), '', dataElement),
          '</tbody>',
        '</table>',
      ])), '', splittedData),
    '</div>',
    '<table style="font-size: 14px; border: 1px solid #e5e5e5; border-collapse: collapse; border-spacing: 0; margin-left: 16px; color: #333">',
      '<tbody>',
          '<tr>',
            '<td style="background: #333; color: #eee; padding: 16px 12px; border: 1px solid #e5e5e5; text-align: center;">Потрачено</td>',
            '<td style="padding: 16px 12px; border: 1px solid #e5e5e5; font-weight: bold;">',
              formatMoney(totalCost),
            '</td>',
          '</tr>',
          '<tr>',
            '<td style="background: #333; color: #eee; padding: 16px 12px; border: 1px solid #e5e5e5; text-align: center;">Осталось</td>',
            '<td style="',
              'padding: 16px 12px;',
              'border: 1px solid #e5e5e5;',
              'font-weight: bold;',
              'color: ',
              ifElse(isNegative, always('#b53737'), always('#333'))(totalBudget),
            '">',
              formatMoney(totalBudget),
            '</td>',
        ' </tr>',
      '</tbody>',
    '</table>',
  ])
  /* eslint-enable @typescript-eslint/indent */

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1048, height: 950, deviceScaleFactor: 3 })
  await page.setContent(html)
  const image = await page.screenshot()
  await browser.close()

  return image
}

export default getReport
