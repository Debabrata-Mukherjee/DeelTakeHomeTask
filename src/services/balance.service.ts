import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PROFILE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Contract } from 'src/entities/contract.entity';
import { Job } from 'src/entities/job.entity';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  // Deposit money into Client's account, Also, handle concurrency
  async depositMoney(
    userId: number,
    amount: number,
  ): Promise<{ message: string; updatedBalance: number }> {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const client = await Profile.findOne({
        where: { id: userId, type: 'client' },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!client) {
        throw new UnauthorizedException('Client not found');
      }

      const unpaidJobs = await Job.findAll({
        where: { paid: false },
        include: [
          {
            model: Contract,
            as: 'contract',
            where: { clientId: userId },
          },
        ],
        attributes: ['price'],
        raw: true,
        transaction,
      });

      // Unpaid Job Total
      const totalUnpaidJobs = unpaidJobs.reduce(
        (sum, job) => sum + job.price,
        0,
      );

      const maxDeposit = totalUnpaidJobs * 0.25;
      if (amount > maxDeposit) {
        throw new BadRequestException(
          `Deposit exceeds allowed limit. Max allowed: ${maxDeposit}`,
        );
      }

      const updatedBalance = client.dataValues.balance + amount;
      await Profile.update(
        { balance: updatedBalance },
        { where: { id: userId }, transaction },
      );

      await transaction.commit();

      return {
        message: 'Deposit successful',
        updatedBalance,
      };
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(
        'Deposit failed: ' +
          (error instanceof Error ? error.message : ' for unknown reasons'),
      );
    }
  }
}
