import puppeteer from 'puppeteer'

import {
  add,
  always,
  both,
  compose,
  concat,
  divide,
  gt,
  head,
  identity,
  ifElse,
  is,
  join,
  length,
  multiply,
  propOr,
  reduce,
  splitEvery,
  subtract,
} from 'ramda'

import { getData, getSettings } from '.'
import { DataElement } from '../typings'
import { env, formatMoney, isOdd, reduceIndexed } from '../utils'

const getReport = async () => {
  const settings = await getSettings()
  const budget: number = propOr(0, 'budget', settings)
  const isNegative = both(is(Number), gt(0))
  const data: DataElement[] = await getData()
  const splitArray = (array: any[]) =>
    splitEvery(Math.ceil(divide(length(array), 2)), array)
  const splittedData: DataElement[][] = splitArray(data)
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
    '<link ',
      'href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" ',
      'rel="stylesheet"',
    '>',
    '<style>',
      'body { font-family: Verdana, Arial, Roboto, sans-serif; margin: 0; }',
    '</style>',
    '<div style="display: flex;">',
      reduce((
        accumulator: string,
        dataElement: DataElement[],
      ): string => concat(accumulator, join('', [
        '<table style="',
          'border: 1px solid #e5e5e5;',
          'border-collapse: collapse;',
          'border-spacing: 0;',
          'margin: 16px 0 16px 16px;',
          'width: 500px;',
          'color: #333;',
        '">',
          '<thead style="',
            'background: #333;',
            'color: #eee;',
            'border: 1px solid #333',
          '">',
            '<tr>',
              reduce((result: string, title: string) =>
                concat(result, join('', [
                  '<th style="',
                    'font-size: 12px;',
                    'font-weight: normal;',
                    'padding: 16px 18px;',
                    'text-align: left',
                  '">',
                    title,
                  '</th>',
                ])),
              '', ['Дата', 'Траты', 'Бюджет на день', 'Сальдо']),
            '</tr>',
          '</thead>',
          '<tbody>',
            reduceIndexed((
              result: string,
              { date, dayCost, dayBudget, isToday }: DataElement,
              index: number,
            ): string => concat(
              result,
              join('', [
                '<tr style="font-size: 14px;',
                  'background: #f8f8f8;',
                  'border-top: 1px solid #e5e5e5;',
                  'border-bottom: 1px solid #e5e5e5;',
                  'background: ',
                  ifElse(isOdd, always('#f8f8f8'), always('#fff'))(index),
                '">',
                  '<td style="',
                    'padding: 16px 12px;',
                    'font-weight: ',
                    ifElse(identity, always('bold'), always('normal'))(isToday),
                  '">',
                    date,
                  '</td>',
                  '<td style="padding: 16px 12px">',
                    formatMoney(dayCost),
                  '</td>',
                  '<td style="padding: 16px 12px; color: ',
                    ifElse(
                      isNegative,
                      always('#b53737'),
                      always('#00ae5d'),
                    )(dayBudget),
                  '">',
                    formatMoney(dayBudget),
                  '</td>',
                  '<td style="padding: 16px 12px; color: ',
                    ifElse(
                      isNegative,
                      always('#b53737'),
                      always('#00ae5d'),
                    )(subtract(dayBudget, dayCost)),
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
    '<table style="',
      'font-size: 14px;',
      'border: 1px solid #e5e5e5;',
      'border-collapse: collapse;',
      'border-spacing: 0;',
      'margin-left: 16px;',
      'color: #333;',
    '">',
      '<tbody>',
          '<tr>',
            '<td style="',
              'font-size: 12px;',
              'background: #333;',
              'color: #eee;',
              'padding: 16px 12px;',
              'border: 1px solid #e5e5e5;',
              'text-align: center;',
            '">',
              'Потрачено',
            '</td>',
            '<td style="',
              'padding: 16px 12px;',
              'border: 1px solid #e5e5e5;',
              'font-weight: bold;',
            '">',
              formatMoney(totalCost),
            '</td>',
          '</tr>',
          '<tr>',
            '<td style="',
              'font-size: 12px;',
              'background: #333;',
              'color: #eee;',
              'padding: 16px 12px;',
              'border: 1px solid #e5e5e5;',
              'text-align: center;',
            '">',
              'Осталось',
            '</td>',
            '<td style="',
              'padding: 16px 12px;',
              'border: 1px solid #e5e5e5;',
              'font-weight: bold;',
              'color: ',
              ifElse(
                isNegative,
                always('#b53737'),
                always('#333'),
              )(totalBudget),
            '">',
              formatMoney(totalBudget),
            '</td>',
        ' </tr>',
      '</tbody>',
    '</table>',
  ])
  /* eslint-enable @typescript-eslint/indent */

  const browser = await puppeteer.launch({
    executablePath: env('CHROME_BIN') || undefined,
    args: ['--no-sandbox', '--headless', '--disable-gpu'],
    defaultViewport: null,
  })
  const page = await browser.newPage()
  const getPageHeightByData = ifElse(
    is(Array),
    compose(
      add(102) /* Total table */,
      add(96) /* Table header and paddings */,
      multiply(50) /* Table rows */,
      length,
      head as (elements: DataElement[][]) => DataElement[],
      splitArray,
    ),
    always(0),
  )

  await page.setViewport({
    width: 1048,
    height: getPageHeightByData(data),
    deviceScaleFactor: 3,
  })
  await page.setContent(html)
  const image = await page.screenshot()
  await browser.close()

  return image
}

export default getReport
