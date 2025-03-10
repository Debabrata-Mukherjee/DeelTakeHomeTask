/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from '../services/balance.service';
import { PROFILE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { Profile } from '../entities/profile.entity';
import { Job } from '../entities/job.entity';
import { Contract } from '../entities/contract.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // ✅ Use an in-memory database for testing
      models: [Profile, Job, Contract], // ✅ Register models
      logging: false,
    });

    await sequelize.sync({ force: true }); // ✅ Ensure fresh test DB
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: PROFILE_REPOSITORY,
          useValue: Profile,
        },
        {
          provide: SEQUELIZE,
          useValue: sequelize,
        },
      ],
    }).compile();

    balanceService = module.get<BalanceService>(BalanceService);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('depositMoney', () => {
    it('should successfully deposit amount in client profile', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'John',
            lastName: 'Cena',
            profession: 'Wizard',
            balance: 1150,
            type: 'client',
          },
          {
            firstName: 'Ron',
            lastName: 'Cena',
            profession: 'Painter',
            balance: 100,
            type: 'contractor',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      const contracts = await Contract.bulkCreate(
        [
          {
            terms: 'Work Contract',
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
            description: 'Work Task',
            price: 1000,
            paid: false,
            contractId: contracts[0].id,
          },
        ] as unknown as Job[],
        { validate: true },
      );

      await balanceService.depositMoney(profiles[0].id, 200);
      const updatedClient = await Profile.findByPk(profiles[0].id);

      expect(updatedClient).toBeDefined();
      expect(updatedClient?.dataValues.balance).toBe(1350);
    });

    it('should throw an error if deposit amount exceeds 25% of total unpaid jobs', async () => {
      const profiles = await Profile.bulkCreate(
        [
          {
            firstName: 'John',
            lastName: 'Cena',
            profession: 'Wizard',
            balance: 1150,
            type: 'client',
          },
          {
            firstName: 'Ron',
            lastName: 'Cena',
            profession: 'Painter',
            balance: 100,
            type: 'contractor',
          },
        ] as unknown as Profile[],
        { validate: true },
      );

      await expect(
        balanceService.depositMoney(profiles[0].id, 500),
      ).rejects.toThrow(
        new BadRequestException(
          'Deposit failed: Deposit exceeds allowed limit. Max allowed: 0',
        ),
      );
    });

    it('should throw an error if the client does not exist', async () => {
      await expect(balanceService.depositMoney(9999, 200)).rejects.toThrow(
        new UnauthorizedException('Deposit failed: Client not found'),
      );
    });

    it('should throw an error if the deposit amount is zero or negative', async () => {
      const profile = await Profile.create({
        firstName: 'Invalid',
        lastName: 'User',
        profession: 'Unknown',
        balance: 500,
        type: 'client',
      } as unknown as Profile);

      await expect(
        balanceService.depositMoney(profile.id, -50),
      ).rejects.toThrow(
        new BadRequestException('Deposit amount must be greater than zero'),
      );

      await expect(balanceService.depositMoney(profile.id, 0)).rejects.toThrow(
        new BadRequestException('Deposit amount must be greater than zero'),
      );
    });
  });
});
