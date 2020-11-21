/* eslint-disable fp/no-class */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Purchase } from '.'

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ unique: true })
  public name!: string

  @OneToMany(() => Purchase, purchase => purchase.category)
  public purchases!: Purchase[]

  @Column({ default: false })
  public archived!: boolean
}

export default Category
