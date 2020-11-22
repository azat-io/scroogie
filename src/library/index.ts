import { Context as TelegrafContext } from 'telegraf'
import schedule from 'node-schedule'

import {
  compose,
  cond,
  equals,
  filter,
  flip,
  forEach,
  has,
  invoker,
  map,
  pick,
} from 'ramda'

import bot from '../bot'

import {
  ADD_CATEGORY,
  BASE,
  REMOVE_COST,
  SET_BUDGET_SUM,
  SET_COST_SUM,
} from '../constants'

import start from './start'

import addCategory from './add-category'
import base from './base'
import cancel from './cancel'
import dailyReport from './daily-report'
import getReport from './get-report'
import getSettings from './get-settings'
import help from './help'
import removeCategory from './remove-category'
import removeCost from './remove-cost'
import removeCostNum from './remove-cost-num'
import setBudget from './set-budget'
import setBudgetSum from './set-budget-sum'
import setCost from './set-cost'
import setCostSum from './set-cost-sum'

import state, { State, Status } from './state'

type Command = {
  command: string
  description?: string
  action: (context: TelegrafContext) => void
}

const commands: Command[] = [
  {
    command: 'start',
    action: start,
  },
  {
    command: 'get_report',
    description: 'Получить отчёт по текущему расчётному периоду',
    action: getReport,
  },
  {
    command: 'get_settings',
    description: 'Получить текущие настройки приложения',
    action: getSettings,
  },
  {
    command: 'set_budget',
    description: 'Установить ежемесячный бюджет',
    action: setBudget,
  },
  {
    command: 'set_cost',
    description: 'Добавить обязательную трату',
    action: setCost,
  },
  {
    command: 'remove_cost',
    description: 'Удалить обязательную трату',
    action: removeCost,
  },
  {
    command: 'remove_category',
    description: 'Удалить существующую категорию',
    action: removeCategory,
  },
  {
    command: 'help',
    description: 'Получить информацию о боте',
    action: help,
  },
  {
    command: 'cancel',
    description: 'Отменить текущую операцию',
    action: cancel,
  },
]

const getCommandsWithDescription = compose(
  map(pick(['command', 'description'])),
  filter(has('description')),
) as (commands: Command[]) => { command: string; description: string }[]

bot.telegram.setMyCommands(getCommandsWithDescription(commands))

const setCommandActions = forEach(({ command, action }: Command) =>
  bot.command(command, action),
) as (commands: Command[]) => void

setCommandActions(commands)

bot.on('text', (context: TelegrafContext) => {
  const status = (statusCode: Status) =>
    compose(equals(statusCode), flip(invoker(0, 'getStatus')))

  const handleMessage = (cond([
    [status(ADD_CATEGORY), addCategory],
    [status(BASE), base],
    [status(REMOVE_COST), removeCostNum],
    [status(SET_BUDGET_SUM), setBudgetSum],
    [status(SET_COST_SUM), setCostSum],
  ]) as unknown) as (context: TelegrafContext, state: State) => any

  return handleMessage(context, state)
})

schedule.scheduleJob('0 0 * * *', dailyReport)
