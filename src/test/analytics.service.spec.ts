// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Test, TestingModule } from '@nestjs/testing';
// import { AnalyticsService } from '../services/analytics.service';
// import { Sequelize } from 'sequelize-typescript';
// import { SEQUELIZE } from 'src/core/constants';
// import { Profile } from '../entities/profile.entity';
// import { Contract } from '../entities/contract.entity';
// import { Job } from '../entities/job.entity';

// describe('AnalyticsService', () => {
//   let analyticsService: AnalyticsService;
//   let sequelize: Sequelize;

//   beforeAll(async () => {
//     sequelize = new Sequelize({
//       dialect: 'sqlite',
//       storage: ':memory:', // ✅ Use an in-memory database for testing
//       models: [Profile, Contract, Job], // ✅ Register models
//       logging: false,
//     });

//     await sequelize.sync({ force: true }); // ✅ Ensures a clean test database
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AnalyticsService,
//         {
//           provide: SEQUELIZE,
//           useValue: sequelize,
//         },
//       ],
//     }).compile();

//     analyticsService = module.get<AnalyticsService>(AnalyticsService);
//   });

//   afterAll(async () => {
//     await sequelize.close();
//   });

//   // ✅ Setup test data before running queries
//   beforeEach(async () => {
//     const clients = await Profile.bulkCreate(
//       [
//         {
//           firstName: 'Harry',
//           lastName: 'Potter',
//           profession: 'Wizard',
//           balance: 1150,
//           type: 'client',
//         },
//         {
//           firstName: 'John',
//           lastName: 'Wick',
//           profession: 'Assassin',
//           balance: 2000,
//           type: 'client',
//         },
//         {
//           firstName: 'Iron',
//           lastName: 'Man',
//           profession: 'Inventor',
//           balance: 5000,
//           type: 'client',
//         },
//       ] as Profile[],
//       { validate: true },
//     );

//     const contractors = await Profile.bulkCreate(
//       [
//         {
//           firstName: 'Bruce',
//           lastName: 'Wayne',
//           profession: 'Engineer',
//           balance: 3000,
//           type: 'contractor',
//         },
//         {
//           firstName: 'Peter',
//           lastName: 'Parker',
//           profession: 'Photographer',
//           balance: 1500,
//           type: 'contractor',
//         },
//         {
//           firstName: 'Clark',
//           lastName: 'Kent',
//           profession: 'Journalist',
//           balance: 2500,
//           type: 'contractor',
//         },
//       ] as Profile[],
//       { validate: true },
//     );

//     const contracts = await Contract.bulkCreate(
//       [
//         {
//           terms: 'Contract 1',
//           status: 'terminated',
//           clientId: clients[0].id,
//           contractorId: contractors[0].id,
//         },
//         {
//           terms: 'Contract 2',
//           status: 'in_progress',
//           clientId: clients[1].id,
//           contractorId: contractors[1].id,
//         },
//         {
//           terms: 'Contract 3',
//           status: 'new',
//           clientId: clients[2].id,
//           contractorId: contractors[2].id,
//         },
//       ] as Contract[],
//       { validate: true },
//     );

//     await Job.bulkCreate(
//       [
//         {
//           description: 'Work 1',
//           price: 1000,
//           paid: true,
//           paymentDate: new Date('2024-03-01'),
//           contractId: contracts[0].id,
//         },
//         {
//           description: 'Work 2',
//           price: 2000,
//           paid: true,
//           paymentDate: new Date('2024-03-02'),
//           contractId: contracts[1].id,
//         },
//         {
//           description: 'Work 3',
//           price: 3000,
//           paid: true,
//           paymentDate: new Date('2024-03-03'),
//           contractId: contracts[1].id,
//         },
//         {
//           description: 'Work 4',
//           price: 4000,
//           paid: true,
//           paymentDate: new Date('2024-03-04'),
//           contractId: contracts[2].id,
//         },
//         {
//           description: 'Work 5',
//           price: 5000,
//           paid: true,
//           paymentDate: new Date('2024-03-05'),
//           contractId: contracts[0].id,
//         },
//       ] as Job[],
//       { validate: true },
//     );
//   });

//   describe('getBestProfession', () => {
//     it('should return the profession with the highest earnings', async () => {
//       const bestProfession: BestProfession | { message: string } =
//         await analyticsService.getBestProfession('2024-03-01', '2024-03-10');

//       if ('message' in bestProfession) {
//         throw new Error('No profession found, but expected Engineer');
//       }

//       expect(bestProfession.profession).toBe('Engineer');
//       expect(bestProfession.totalEarnings).toBe(6000);
//     });

//     it('should return "No data found" if no profession has earnings', async () => {
//       const bestProfession: BestProfession | { message: string } =
//         await analyticsService.getBestProfession('2025-01-01', '2025-02-01');

//       expect(bestProfession).toEqual({ message: 'No data found' });
//     });
//   });

//   describe('getBestClients', () => {
//     it('should return the top paying clients', async () => {
//       const bestClients: BestClient[] | { message: string } =
//         await analyticsService.getBestClients('2024-03-01', '2024-03-10', 2);

//       if (!Array.isArray(bestClients)) {
//         throw new Error(
//           'Expected an array of clients, but got: ' +
//             JSON.stringify(bestClients),
//         );
//       }

//       expect(bestClients).toBeDefined();
//       expect(bestClients.length).toBe(2);
//       expect(bestClients[0].clientName).toBe('John Wick'); // Ensure correct top-paying client
//       expect(bestClients[0].totalPaid).toBe(5000);
//     });

//     it('should return "No data found" if there are no paying clients', async () => {
//       const bestClients: BestClient[] | { message: string } =
//         await analyticsService.getBestClients('2025-01-01', '2025-02-01', 2);

//       expect(bestClients).toEqual({ message: 'No data found' });
//     });
//   });
// });
