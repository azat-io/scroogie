/* eslint-disable fp/no-class */

import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
class Settings {
  @PrimaryColumn()
  public id!: string

  @Column({
    type: 'float',
  })
  public budget?: number

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public costs?: Array<{ name: string; sum: number }>
}

export default Settings
