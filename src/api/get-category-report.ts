import puppeteer from 'puppeteer'
import { Between } from 'typeorm'

import { endOfMonth, startOfMonth } from 'date-fns/fp'
import {
  add,
  always,
  applySpec,
  compose,
  concat,
  dec,
  descend,
  equals,
  divide,
  eqBy,
  groupWith,
  head,
  ifElse,
  inc,
  join,
  last,
  length,
  lt,
  map,
  path,
  prop,
  reduce,
  sort,
  splitAt,
  when,
} from 'ramda'

import { getPurchases } from '.'

import { Purchase } from '../typings'
import {
  env,
  formatMoney,
  formatPercent,
  isOdd,
  mapIndexed,
  reduceIndexed,
} from '../utils'

type DataElement = {
  color: string | undefined
  name: string
  sum: number
  percent: number
}

const getCategoryReport = async () => {
  const currentDate = new Date()
  const start: Date = startOfMonth(currentDate)
  const end: Date = endOfMonth(currentDate)
  const BetweenDates = Between(start, end)
  const purchases: Purchase[] = await getPurchases({
    where: {
      addedAt: BetweenDates,
    },
  })
  const segmentByCategoryId = groupWith(
    eqBy(path(['category', 'id'])) as (purchase: Purchase) => boolean,
  )
  const segmentedPurchases = segmentByCategoryId(purchases)
  const colors: string[] = [
    '#869B76',
    '#B9AC5D',
    '#959F65',
    '#CCD7A9',
    '#E7E6C6',
    '#BBBD9E',
    '#666F64',
  ]
  const MAX_LEN = length(colors)
  const makeData = compose(
    when(
      compose(lt(MAX_LEN), length),
      compose(
        (elementSegments: DataElement[][]): DataElement[] =>
          concat(head(elementSegments) as DataElement[], [
            reduce(
              (
                accumulator: DataElement,
                element: DataElement,
              ): DataElement => ({
                name: accumulator.name,
                color: accumulator.color,
                sum: add(accumulator.sum, element.sum),
                percent: add(accumulator.percent, element.percent),
              }),
              {
                name: 'Остальное',
                color: colors[dec(MAX_LEN)],
                sum: 0,
                percent: 0,
              },
              last(elementSegments) as DataElement[],
            ),
          ]),
        splitAt(dec(MAX_LEN)) as (elements: DataElement[]) => DataElement[][],
      ),
    ),
    mapIndexed(
      (
        element: { name: string; sum: number },
        index,
        elementList,
      ): DataElement => ({
        ...element,
        color: colors[index],
        percent: divide(
          element.sum,
          reduce(
            (accumulator, { sum }) => add(accumulator, sum),
            0,
            elementList,
          ),
        ),
      }),
    ) as (elements: { name: string; sum: number }[]) => DataElement[],
    sort(descend(prop('sum'))),
    map(
      (applySpec({
        name: compose(path(['category', 'name']), head),
        sum: reduce(
          (accumulator: number, current: Purchase): number =>
            add(accumulator, prop('sum', current)),
          0,
        ),
      }) as unknown) as (segment: Purchase[]) => { name: string; sum: number },
    ),
  )
  const data: DataElement[] = makeData(segmentedPurchases)

  /* eslint-disable @typescript-eslint/indent */
  /* eslint-disable no-template-curly-in-string */
  // prettier-ignore
  const html = join('', [
    '<link rel="preconnect" href="https://fonts.gstatic.com">',
    '<link ',
      'href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" ',
      'rel="stylesheet"',
    '>',
    '<style>',
      'body {',
        'font-family: Verdana, Arial, Roboto, sans-serif;',
        'font-size: 15px;',
        'margin: 32px 16px;',
      '}',
      'svg {',
        'height: 200px;',
      '}',
    '</style>',
    '<div style="display: flex; justify-content: space-between;">',
      '<div style="',
        'display: flex;',
        'align-items: center;',
        'width: 200px;',
        'height: 400px;',
      '">',
        '<svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)"></svg>',
      '</div>',
      '<table style="',
        'border-collapse: collapse;',
        'border-spacing: 0;',
        'margin: 16px 0 16px 16px;',
        'width: 500px;',
        'color: #333;',
      '">',
        '<tbody>',
          reduceIndexed(
            (accumulator: string,
            { color, name, sum, percent }: DataElement,
            index: number,
            list: DataElement[],
          ) => join('', [
            accumulator,
            '<tr style="font-size: 14px;',
              'background: #f8f8f8;',
              'border-bottom:',
              ifElse(
                compose(equals(inc(index)), length),
                always('0;'),
                always('1px solid #e5e5e5;'),
              )(list),
              'background: ',
              ifElse(isOdd, always('#f8f8f8'), always('#fff'))(index),
            '">',
              '<td style="padding: 0 12px">',
                '<span style="',
                  'display: inline-block;',
                  'min-width: 16px;',
                  'height: 16px;',
                  `background: ${color};`,
                '">',
                '</span>',
              '</td>',
              '<td style="padding: 16px 12px; max-width: 100px;">',
                '<span style="',
                  'display: block;',
                  'text-overflow: ellipsis;',
                  'overflow: hidden;',
                  'font-size: 14px;',
                  'white-space: nowrap;',
                '">',
                  name,
                '</span>',
              '</td>',
              '<td style="padding: 16px 12px">',
                formatMoney(sum),
              '</td>',
              '<td style="padding: 16px 12px">',
                formatPercent(percent),
              '</td>',
            '</tr>',
          ]), '', data),
        '</tbody>',
      '</table>',
    '</div>',
    '<script>',
      'const svgEl = document.querySelector(\'svg\');',
      'const slices = ',
        JSON.stringify(data),
      ';',
      'let cumulativePercent = 0;',
      'function getCoordinatesForPercent(percent) {',
        'const x = Math.cos(2 * Math.PI * percent);',
        'const y = Math.sin(2 * Math.PI * percent);',
        'return [x, y];',
      '}',
      'slices.forEach(slice => {',
        'const [startX, startY] = ',
          'getCoordinatesForPercent(cumulativePercent);',
        'cumulativePercent += slice.percent;',
        'const [endX, endY] = getCoordinatesForPercent(cumulativePercent);',
        'const largeArcFlag = slice.percent > .5 ? 1 : 0;',
        'const pathData = [',
          '`M ${startX} ${startY}`,',
          '`A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,',
          '`L 0 0`,',
        '].join(\' \');',
        'const pathEl = document.createElementNS(',
          '\'http://www.w3.org/2000/svg\',',
          '\'path\'',
        ');',
        'pathEl.setAttribute(\'d\', pathData);',
        'pathEl.setAttribute(\'fill\', slice.color);',
        'svgEl.appendChild(pathEl);',
      '});',
    '</script>',
  ])

  /* eslint-enable @typescript-eslint/indent */
  /* eslint-enable no-template-curly-in-string */

  const browser = await puppeteer.launch({
    executablePath: env('CHROME_BIN') || undefined,
    args: ['--no-sandbox', '--headless', '--disable-gpu'],
    defaultViewport: null,
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 768,
    height: 464,
    deviceScaleFactor: 3,
  })
  await page.setContent(html)
  const image = await page.screenshot()
  await browser.close()
  return image
}

export default getCategoryReport
