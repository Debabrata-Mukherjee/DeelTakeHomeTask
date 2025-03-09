import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { RequestWithProfile } from 'src/core/types/requestWithProfile';
import { ContractService } from 'src/services/contract.service';

@Controller('contracts')
@UseGuards(AuthGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getContractById(
    @Param('id') id: number,
    @Req() req: RequestWithProfile,
  ) {
    if (!req.profile) {
      throw new UnauthorizedException('Profile not found in request');
    }

    const contract = await this.contractService.findContractById(
      id,
      req.profile,
    );
    return {
      message: contract
        ? 'Contract found'
        : 'No contract found for the given ID and profile',
      ...contract,
    };
  }

  // Returns a list of contracts belonging to a user (client or contractor). The list should only contain non-terminated contracts
  @Get()
  @HttpCode(HttpStatus.OK)
  async getActiveContracts(@Req() req: RequestWithProfile) {
    if (!req.profile) {
      throw new UnauthorizedException('Profile not found in request');
    }

    const { contracts } = await this.contractService.findUserActiveContracts(
      req.profile,
    );

    return {
      message:
        contracts.length > 0
          ? 'Active contracts found'
          : 'No active contracts found',
      contracts: contracts.length > 0 ? contracts : [],
    };
  }
}
