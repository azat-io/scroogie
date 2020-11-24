import puppeteer from 'puppeteer'
import { Between } from 'typeorm'

import { endOfMonth, startOfMonth } from 'date-fns/fp'
import {
  add,
  applySpec,
  compose,
  descend,
  divide,
  eqBy,
  groupWith,
  head,
  join,
  map,
  path,
  prop,
  reduce,
  sort,
} from 'ramda'

import { getPurchases } from '.'

import { Purchase } from '../typings'
import { mapIndexed } from '../utils'

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
  const makeData = compose(
    mapIndexed(
      (element: { name: string; sum: number }, index, elementList) => ({
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
    ),
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
  const data = makeData(segmentedPurchases)

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
        'margin: 48px 16px;',
      '}',
      'svg {',
        'height: 200px;',
      '}',
    '</style>',
    '<div style="display: flex; justify-content: space-between;">',
      '<svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)"></svg>',
      '<div>',
        reduce((accumulator, { color, name }) => join('', [
          accumulator,
          '<div style="',
            'display: flex;',
            'align-items: center;',
            'width: 200px;',
            'margin: 8px 0;',
          '">',
            '<span style="',
              'display: inline-block;',
              'min-width: 16px;',
              'height: 16px;',
              'margin-right: 8px;',
              `background: ${color};`,
            '">',
            '</span>',
            '<span style="',
              'text-overflow: ellipsis;',
              'overflow: hidden;',
              'font-size: 14px;',
              'white-space: nowrap;',
            '">',
              name,
            '</span>',
          '</div>',
        ]), '', data),
      '</div>',
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

  const browser = await puppeteer.launch({ defaultViewport: null })
  const page = await browser.newPage()
  await page.setViewport({
    width: 448,
    height: 296,
    deviceScaleFactor: 3,
  })
  await page.setContent(html)
  const image = await page.screenshot()
  await browser.close()

  return image
}

export default getCategoryReport
