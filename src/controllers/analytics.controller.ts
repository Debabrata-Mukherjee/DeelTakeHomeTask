import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { IsAdminGuard } from 'src/core/guards/isAdmin.guard';
import { AnalyticsService } from 'src/services/analytics.service';

@Controller('admin')
@UseGuards(IsAdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Get the best profession based on earnings within a time range
  @Get('best-profession')
  async getBestProfession(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start and End dates are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.analyticsService.getBestProfession(startDate, endDate);
  }

  // Get the best clients who paid the most within a time range (default limit = 2)
  @Get('best-clients')
  async getBestClients(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
    @Query('limit') limit = 2,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start and End dates are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.analyticsService.getBestClients(
      startDate,
      endDate,
      Number(limit),
    );
  }
}
