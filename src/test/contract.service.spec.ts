/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Sequelize } from 'sequelize-typescript';
import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from 'src/services/contract.service';
import { Contract } from 'src/entities/contract.entity';
import { Profile } from 'src/entities/profile.entity';
import { Job } from 'src/entities/job.entity'; // ✅ Import Job
import { CONTRACT_REPOSITORY } from 'src/core/constants';

describe('ContractService', () => {
  let contractService: ContractService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // ✅ Use an in-memory database for testing
      models: [Profile, Contract, Job], // ✅ Register ALL related models
      logging: false, // ✅ Disable logs during testing
    });

    await sequelize.sync({ force: true }); // ✅ Ensure tables are created

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: CONTRACT_REPOSITORY,
          useValue: Contract,
        },
      ],
    }).compile();

    contractService = module.get<ContractService>(ContractService);
  });

  afterAll(async () => {
    await sequelize.close(); // ✅ Ensure DB connection is closed
  });

  it('should return contract if profile is the client or contractor', async () => {
    // ✅ Fix TypeScript issues with type assertion
    const profile = await Profile.create({
      firstName: 'Test',
      lastName: 'User',
      profession: 'Developer',
      balance: 5000,
      type: 'client',
    } as unknown as Profile);

    const contract = await Contract.create({
      terms: 'Sample Contract',
      status: 'in_progress',
      clientId: profile.id,
      contractorId: profile.id,
    } as unknown as Contract);

    const result = await contractService.findContractById(contract.id, profile);
    expect(result).toBeDefined();
    expect(result?.contract.id).toBe(contract.id);
  });

  it('should return null if contract does not exist', async () => {
    const profile = await Profile.create({
      firstName: 'Test',
      lastName: 'User',
      profession: 'Developer',
      balance: 5000,
      type: 'client',
    } as unknown as Profile);

    const result = await contractService.findContractById(9999, profile);
    expect(result).toBeNull();
  });
});
