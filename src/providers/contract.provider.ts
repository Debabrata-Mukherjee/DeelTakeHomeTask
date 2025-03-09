import { CONTRACT_REPOSITORY } from 'src/core/constants';
import { Contract } from 'src/entities/contract.entity';

export const contractProviders = [
  {
    provide: CONTRACT_REPOSITORY,
    useValue: Contract,
  },
];
