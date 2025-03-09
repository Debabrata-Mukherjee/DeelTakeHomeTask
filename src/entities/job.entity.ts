import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Contract } from './contract.entity';

@Table({
  tableName: 'jobs',
  timestamps: true, //  Includes createdAt & updatedAt automatically
})
export class Job extends Model<Job> {
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  price!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  paid!: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  paymentDate?: Date;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contractId!: number;

  @BelongsTo(() => Contract, { foreignKey: 'contractId', as: 'contract' })
  contract!: Contract;
}
