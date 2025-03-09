/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Sequelize } from 'sequelize-typescript';
import { Contract } from 'src/entities/contract.entity';
import { Job } from 'src/entities/job.entity';
import { Profile } from 'src/entities/profile.entity';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: true, // Enable query logging
  models: [Profile, Contract, Job],
});

async function seedDatabase() {
  await sequelize.sync({ force: true }); // Drops tables and recreates them

  console.log(' Deleting existing data...');
  await Job.destroy({ where: {} });
  await Contract.destroy({ where: {} });
  await Profile.destroy({ where: {} });

  console.log(' Inserting profiles...');
  const profiles = await Profile.bulkCreate(
    [
      {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
      },
      {
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type: 'client',
      },
      {
        id: 3,
        firstName: 'John',
        lastName: 'Snow',
        profession: 'Knows nothing',
        balance: 451.3,
        type: 'client',
      },
      {
        id: 4,
        firstName: 'Ash',
        lastName: 'Kethcum',
        profession: 'Pokemon master',
        balance: 1.3,
        type: 'client',
      },
      {
        id: 5,
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type: 'contractor',
      },
      {
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
        type: 'contractor',
      },
      {
        id: 7,
        firstName: 'Alan',
        lastName: 'Turing',
        profession: 'Programmer',
        balance: 22,
        type: 'contractor',
      },
      {
        id: 8,
        firstName: 'Aragorn',
        lastName: 'II Elessar Telcontarvalds',
        profession: 'Fighter',
        balance: 314,
        type: 'contractor',
      },
    ] as unknown as Profile[],
    { validate: true },
  );

  console.log(' Inserting contracts...');
  const contracts = await Contract.bulkCreate(
    [
      {
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        clientId: 1,
        contractorId: 5,
      },
      {
        id: 2,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 1,
        contractorId: 6,
      },
      {
        id: 3,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 2,
        contractorId: 6,
      },
      {
        id: 4,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 2,
        contractorId: 7,
      },
      {
        id: 5,
        terms: 'bla bla bla',
        status: 'new',
        clientId: 3,
        contractorId: 8,
      },
      {
        id: 6,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 3,
        contractorId: 7,
      },
      {
        id: 7,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 4,
        contractorId: 7,
      },
      {
        id: 8,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 4,
        contractorId: 6,
      },
      {
        id: 9,
        terms: 'bla bla bla',
        status: 'in_progress',
        clientId: 4,
        contractorId: 8,
      },
    ] as unknown as Contract[],
    { validate: true },
  );

  console.log(' Inserting jobs...');
  await Job.bulkCreate(
    [
      { description: 'work', price: 200, contractId: 1 },
      { description: 'work', price: 201, contractId: 2 },
      { description: 'work', price: 202, contractId: 3 },
      { description: 'work', price: 200, contractId: 4 },
      { description: 'work', price: 200, contractId: 7 },
      {
        description: 'work',
        price: 2020,
        paid: true,
        paymentDate: new Date('2020-08-15T19:11:26.737Z'),
        contractId: 7,
      },
      {
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: new Date('2020-08-15T19:11:26.737Z'),
        contractId: 2,
      },
      {
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: new Date('2020-08-16T19:11:26.737Z'),
        contractId: 3,
      },
      {
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: new Date('2020-08-17T19:11:26.737Z'),
        contractId: 1,
      },
      {
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: new Date('2020-08-17T19:11:26.737Z'),
        contractId: 5,
      },
      {
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: new Date('2020-08-10T19:11:26.737Z'),
        contractId: 1,
      },
      {
        description: 'work',
        price: 21,
        paid: true,
        paymentDate: new Date('2020-08-15T19:11:26.737Z'),
        contractId: 2,
      },
      {
        description: 'work',
        price: 121,
        paid: true,
        paymentDate: new Date('2020-08-15T19:11:26.737Z'),
        contractId: 3,
      },
      {
        description: 'work',
        price: 121,
        paid: true,
        paymentDate: new Date('2020-08-14T23:11:26.737Z'),
        contractId: 3,
      },
    ] as unknown as Job[],
    { validate: true },
  );

  console.log(' Database seeding completed!');
  await sequelize.close();
}

seedDatabase().catch((err) => {
  console.error(' Error seeding database:', err);
});
