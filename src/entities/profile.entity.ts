import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Contract } from './contract.entity';

@Table({ tableName: 'profiles', timestamps: true })
export class Profile extends Model<Profile> {
  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  profession!: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  balance!: number;

  @Column({
    type: DataType.ENUM('client', 'contractor', 'admin'),
    allowNull: false,
  })
  type!: 'client' | 'contractor' | 'admin';

  @HasMany(() => Contract, { foreignKey: 'clientId', as: 'clientContracts' })
  clientContracts!: Contract[];

  @HasMany(() => Contract, {
    foreignKey: 'contractorId',
    as: 'contractorContracts',
  })
  contractorContracts!: Contract[];
}
