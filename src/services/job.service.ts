/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { JOB_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Profile } from '../entities/profile.entity';
import { Job } from '../entities/job.entity';
import { Sequelize } from 'sequelize-typescript';
import { Contract } from 'src/entities/contract.entity';

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: typeof Job,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}
  async findUnpaidJobs(profile: Profile): Promise<Partial<Job>[]> {
    const jobs = await Job.findAll({
      where: {
        paid: false,
        '$contract.status$': { [Op.in]: ['in_progress'] },
        [Op.or]: [
          { '$contract.clientId$': profile.id },

          { '$contract.contractorId$': profile.id },
        ],
      },
      attributes: [
        ['id', 'id'],
        ['description', 'description'],
        ['price', 'price'],
        ['paid', 'paid'],
        ['paymentDate', 'paymentDate'],
        ['contractId', 'contractId'],
      ],
      include: [
        {
          model: Contract,
          as: 'contract',
          attributes: [],
        },
      ],
      raw: true,
    });

    return jobs;
  }

  async payForJob(
    jobId: number,
    profile: Profile,
  ): Promise<{
    message: string;
    clientId: number;
    contractorId: number;
    clientUpdatedBalance: number;
    contractorUpdatedBalance: number;
    updatedJobPaymentState: boolean;
  }> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const job = await Job.findOne({
        where: { id: jobId, paid: false },
        attributes: ['id', 'price'],
        include: [
          {
            model: Contract,
            as: 'contract',
            attributes: ['id', 'clientId', 'contractorId'],
            required: true,
            include: [
              {
                model: Profile,
                as: 'client',
                attributes: ['id', 'balance'],
                required: true,
              },
              {
                model: Profile,
                as: 'contractor',
                attributes: ['id', 'balance'],
                required: true,
              },
            ],
          },
        ],
        transaction,
        raw: true,
        nest: true, // Ensure proper object nesting
      });

      if (!job) {
        throw new UnauthorizedException('Job not found or already paid for');
      }

      if (!job.contract || !job.contract.client || !job.contract.contractor) {
        throw new UnauthorizedException('Job not found or unauthorized');
      }

      if (job.contract.client.id !== profile.id) {
        throw new UnauthorizedException('Only the client can pay for this job');
      }

      if (job.contract.client.balance < job.price) {
        throw new UnauthorizedException('Insufficient funds for payment');
      }

      const clientUpdatedBalance = job.contract.client.balance - job.price;
      const contractorUpdatedBalance =
        job.contract.contractor.balance + job.price;

      await Profile.update(
        { balance: clientUpdatedBalance },
        { where: { id: job.contract.client.id }, transaction },
      );

      await Profile.update(
        { balance: contractorUpdatedBalance },
        { where: { id: job.contract.contractor.id }, transaction },
      );

      await Job.update(
        { paid: true, paymentDate: new Date() },
        { where: { id: job.id }, transaction },
      );

      await transaction.commit();

      return {
        message: 'Payment successful',
        clientId: job.contract.client.id,
        contractorId: job.contract.contractor.id,
        clientUpdatedBalance,
        contractorUpdatedBalance,
        updatedJobPaymentState: true,
      };
    } catch (error: unknown) {
      await transaction.rollback();
      throw new UnauthorizedException(
        'Payment failed: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }
}
