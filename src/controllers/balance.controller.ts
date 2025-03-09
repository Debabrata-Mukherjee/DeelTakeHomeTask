import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { BalanceService } from 'src/services/balance.service';

@Controller('balances')
@UseGuards(AuthGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // Deposit money into a client's balance
  @Post('deposit/:userId')
  @HttpCode(HttpStatus.OK)
  async depositMoney(
    @Param('userId') userId: number,
    @Body('amount') amount: number,
  ) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid deposit amount');
    }

    return this.balanceService.depositMoney(userId, amount);
  }
}
