import { Inject, Injectable } from '@nestjs/common';
import { CONTRACT_REPOSITORY } from 'src/core/constants';
import { Op } from 'sequelize';
import { Profile } from '../entities/profile.entity';
import { Contract } from 'src/entities/contract.entity';

@Injectable()
export class ContractService {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepository: typeof Contract,
  ) {}

  async findContractById(
    id: number,
    profile: Profile,
  ): Promise<{ contract: Partial<Contract> } | null> {
    const contract = await Contract.findOne({
      where: {
        id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [Op.or]: [{ clientId: profile.id }, { contractorId: profile.id }],
      },
      attributes: [
        'id',
        'terms',
        'status',
        'createdAt',
        'updatedAt',
        'clientId',
        'contractorId',
      ],
      raw: true,
    });

    return contract ? { contract } : null;
  }

  async findUserActiveContracts(
    profile: Profile,
  ): Promise<{ contracts: Partial<Contract>[] }> {
    const contracts = await Contract.findAll({
      where: {
        [Op.and]: [
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [Op.or]: [{ clientId: profile.id }, { contractorId: profile.id }],
          },
          {
            status: { [Op.in]: ['new', 'in_progress'] },
          },
        ],
      },
      attributes: [
        ['id', 'id'],
        ['terms', 'terms'],
        ['status', 'status'],
        ['createdAt', 'createdAt'],
        ['updatedAt', 'updatedAt'],
        ['clientId', 'ClientId'],
        ['contractorId', 'ContractorId'],
      ],
      raw: true,
    });

    return { contracts };
  }
}
