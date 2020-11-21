/* eslint-disable fp/no-class */

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from '.'

@Entity()
class Purchase {
  @PrimaryGeneratedColumn()
  public id!: number

  @ManyToOne(() => Category, category => category.purchases)
  public category!: Category

  @Column({
    type: 'float',
  })
  public sum!: number

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public addedAt!: number

  @Column()
  public addedBy!: number
}

export default Purchase
