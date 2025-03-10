/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../services/analytics.service';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/core/constants';
import { Profile } from '../entities/profile.entity';
import { Contract } from '../entities/contract.entity';
import { Job } from '../entities/job.entity';

interface BestClient {
  id: number;
  clientName: string;
  totalPaid: number;
}

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [Profile, Contract, Job],
      logging: false,
    });

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: SEQUELIZE,
          useValue: sequelize,
        },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    const clients = await Profile.bulkCreate(
      [
        {
          firstName: 'Ash',
          lastName: 'Kethcum',
          profession: 'Trainer',
          balance: 1500,
          type: 'client',
        },
        {
          firstName: 'Mr',
          lastName: 'Robot',
          profession: 'Hacker',
          balance: 1000,
          type: 'client',
        },
        {
          firstName: 'Elliot',
          lastName: 'Alderson',
          profession: 'Cyber Security',
          balance: 800,
          type: 'client',
        },
      ] as unknown as Profile[],
      { validate: true },
    );

    const contractors = await Profile.bulkCreate(
      [
        {
          firstName: 'Walter',
          lastName: 'White',
          profession: 'Chemist',
          balance: 2000,
          type: 'contractor',
        },
        {
          firstName: 'Jesse',
          lastName: 'Pinkman',
          profession: 'Dealer',
          balance: 1200,
          type: 'contractor',
        },
        {
          firstName: 'Heisenberg',
          lastName: '',
          profession: 'Drug Lord',
          balance: 5000,
          type: 'contractor',
        },
      ] as unknown as Profile[],
      { validate: true },
    );

    const contracts = await Contract.bulkCreate(
      [
        {
          terms: 'Contract 1',
          status: 'terminated',
          clientId: clients[0].id, // Ash Kethcum
          contractorId: contractors[0].id, // Walter White
        },
        {
          terms: 'Contract 2',
          status: 'in_progress',
          clientId: clients[1].id, // Mr Robot
          contractorId: contractors[1].id, // Jesse Pinkman
        },
        {
          terms: 'Contract 3',
          status: 'new',
          clientId: clients[2].id, // Elliot Alderson
          contractorId: contractors[2].id, // Heisenberg
        },
      ] as unknown as Contract[],
      { validate: true },
    );

    await Job.bulkCreate(
      [
        {
          description: 'Hacking System',
          price: 2020,
          paid: true,
          paymentDate: new Date('2024-03-01'),
          contractId: contracts[0].id,
        },
        {
          description: 'Building Malware',
          price: 442,
          paid: true,
          paymentDate: new Date('2024-03-02'),
          contractId: contracts[1].id,
        },
      ] as unknown as Job[],
      { validate: true },
    );
  });

  describe('getBestClients', () => {
    it('should return the top paying clients', async () => {
      const bestClients = (await analyticsService.getBestClients(
        '2024-03-01',
        '2024-03-10',
        2,
      )) as BestClient[]; // ✅ Ensure correct type

      expect(Array.isArray(bestClients)).toBe(true);
      expect(bestClients).toBeDefined();
      expect(bestClients.length).toBe(2);
      expect(bestClients[0].clientName).toBe('Ash Kethcum');
      expect(bestClients[0].totalPaid).toBe(2020);
    });

    it('should return "No data found" if there are no paying clients', async () => {
      const bestClients = (await analyticsService.getBestClients(
        '2025-01-01',
        '2025-02-01',
        2,
      )) as BestClient[] | { message: string };

      expect(bestClients).toEqual({ message: 'No data found' });
    });
  });
});
