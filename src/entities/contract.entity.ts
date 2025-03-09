import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { Profile } from './profile.entity';

@Table({ tableName: 'contracts', timestamps: true })
export class Contract extends Model<Contract> {
  @Column({ type: DataType.TEXT, allowNull: false })
  terms!: string;

  @Column({
    type: DataType.ENUM('new', 'in_progress', 'terminated'),
    allowNull: false,
  })
  status!: 'new' | 'in_progress' | 'terminated';

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER, allowNull: false })
  clientId!: number;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contractorId!: number;

  @BelongsTo(() => Profile, { foreignKey: 'clientId', as: 'client' })
  client!: Profile;

  @BelongsTo(() => Profile, { foreignKey: 'contractorId', as: 'contractor' })
  contractor!: Profile;

  @HasMany(() => Job, { foreignKey: 'contractId', as: 'jobs' })
  jobs!: Job[];
}
