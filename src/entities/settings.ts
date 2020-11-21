/* eslint-disable fp/no-class */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Settings {
  @PrimaryGeneratedColumn()
  public id!: number

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
