/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../services/job.service';
import { JOB_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { Job } from '../entities/job.entity';
import { Contract } from '../entities/contract.entity';
import { Profile } from '../entities/profile.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JobService', () => {
  let jobService: JobService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [Job, Contract, Profile],
      logging: false,
    });

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: JOB_REPOSITORY,
          useValue: Job,
        },
        {
          provide: SEQUELIZE,
          useValue: sequelize,
        },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('findUnpaidJobs', () => {
    it('should return unpaid jobs for a profile', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'John',
            lastName: 'Doe',
            profession: 'Developer',
            balance: 5000,
            type: 'client',
          },
          {
            firstName: 'Alice',
            lastName: 'Johnson',
            profession: 'Engineer',
            balance: 2000,
            type: 'contractor',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      const contracts = await Contract.bulkCreate(
        [
          {
            terms: 'Software Development Contract',
            status: 'in_progress',
            clientId: profiles[0].id,
            contractorId: profiles[1].id,
          },
        ] as unknown as Contract[],
        { validate: true },
      );

      await Job.bulkCreate(
        [
          {
            description: 'Frontend Development',
            price: 1000,
            paid: false,
            contractId: contracts[0].id,
          },
        ] as unknown as Job[],
        { validate: true },
      );

      const jobs = await jobService.findUnpaidJobs(profiles[0]);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].paid).toBe(0);
    });

    it('should return an empty array if no unpaid jobs exist', async () => {
      const profile = await Profile.create({
        firstName: 'Jane',
        lastName: 'Smith',
        profession: 'Designer',
        balance: 3000,
        type: 'client',
      } as unknown as Profile);

      const jobs = await jobService.findUnpaidJobs(profile);
      expect(jobs).toEqual([]);
    });
  });

  describe('payForJob', () => {
    it('should successfully process job payment', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'John',
            lastName: 'Doe',
            profession: 'Developer',
            balance: 5000,
            type: 'client',
          },
          {
            firstName: 'Alice',
            lastName: 'Johnson',
            profession: 'Engineer',
            balance: 2000,
            type: 'contractor',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      const contracts = await Contract.bulkCreate(
        [
          {
            terms: 'Freelance Work',
            status: 'in_progress',
            clientId: profiles[0].id,
            contractorId: profiles[1].id,
          },
        ] as unknown as Contract[],
        { validate: true },
      );

      const jobs = await Job.bulkCreate(
        [
          {
            description: 'Frontend UI Design',
            price: 1500,
            paid: false,
            contractId: contracts[0].id,
          },
        ] as unknown as Job[],
        { validate: true },
      );

      const result = await jobService.payForJob(jobs[0].id, profiles[0]);

      expect(result.message).toBe('Payment successful');
      expect(result.clientUpdatedBalance).toBe(3500);
      expect(result.contractorUpdatedBalance).toBe(3500);
      expect(result.updatedJobPaymentState).toBe(true);
    });

    it('should throw an error if the job is not found', async () => {
      const profile = await Profile.create({
        firstName: 'Invalid',
        lastName: 'User',
        profession: 'Tester',
        balance: 1000,
        type: 'client',
      } as unknown as Profile);

      await expect(jobService.payForJob(9999, profile)).rejects.toThrow(
        new UnauthorizedException(
          'Payment failed: Job not found or already paid for',
        ),
      );
    });

    it('should throw an error if profile is not the client', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'John',
            lastName: 'Doe',
            profession: 'Developer',
            balance: 5000,
            type: 'client',
          },
          {
            firstName: 'Eve',
            lastName: 'Hacker',
            profession: 'Security Engineer',
            balance: 7000,
            type: 'client',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      const contracts = await Contract.bulkCreate(
        [
          {
            terms: 'Spy Work',
            status: 'in_progress',
            clientId: profiles[0].id,
            contractorId: profiles[1].id,
          },
        ] as unknown as Contract[],
        { validate: true },
      );

      const jobs = await Job.bulkCreate(
        [
          {
            description: 'Classified Job',
            price: 2000,
            paid: false,
            contractId: contracts[0].id,
          },
        ] as unknown as Job[],
        { validate: true },
      );

      await expect(
        jobService.payForJob(jobs[0].id, profiles[1]),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Payment failed: Only the client can pay for this job',
        ),
      );
    });

    it('should throw an error if client balance is insufficient', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'Poor',
            lastName: 'Guy',
            profession: 'Unemployed',
            balance: 500,
            type: 'client',
          },
          {
            firstName: 'Rich',
            lastName: 'Person',
            profession: 'Investor',
            balance: 10000,
            type: 'contractor',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      const contracts = await Contract.bulkCreate(
        [
          {
            terms: 'Expensive Work',
            status: 'in_progress',
            clientId: profiles[0].id,
            contractorId: profiles[1].id,
          },
        ] as unknown as Contract[],
        { validate: true },
      );

      const jobs = await Job.bulkCreate(
        [
          {
            description: 'Luxury Job',
            price: 2000,
            paid: false,
            contractId: contracts[0].id,
          },
        ] as unknown as Job[],
        { validate: true },
      );

      await expect(
        jobService.payForJob(jobs[0].id, profiles[0]),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Payment failed: Insufficient funds for payment',
        ),
      );
    });
  });
});
