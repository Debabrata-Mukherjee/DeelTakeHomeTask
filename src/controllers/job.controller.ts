import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/profile.guard';
import { RequestWithProfile } from 'src/core/types/requestWithProfile';
import { JobService } from 'src/services/job.service';

@Controller('jobs')
@UseGuards(AuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Get all unpaid jobs for a user (**_either_** a client or contractor), but only for **_active contracts_**.
  @Get('unpaid')
  @HttpCode(HttpStatus.OK)
  async getUnpaidJobs(@Req() req: RequestWithProfile) {
    if (!req.profile) {
      throw new UnauthorizedException('Profile not found in request');
    }

    const unpaidJobs = await this.jobService.findUnpaidJobs(req.profile);

    return {
      message:
        unpaidJobs.length > 0 ? 'Unpaid jobs found' : 'No unpaid jobs found',
      jobs: unpaidJobs,
    };
  }

  //   Pay for a job. A client can only pay if their balance is greater than or equal to the amount due.
  //   The payment amount should be moved from the client's balance to the contractor's balance.
  @Post(':job_id/pay')
  async payJob(@Param('job_id') jobId: number, @Req() req: RequestWithProfile) {
    if (!req.profile) {
      throw new UnauthorizedException('Profile not found in request');
    }

    return this.jobService.payForJob(jobId, req.profile);
  }
}
