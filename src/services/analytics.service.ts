import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/core/constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  // Get the profession with the highest earnings within a given time range
  async getBestProfession(startDate: string, endDate: string) {
    const query = `
      SELECT p.profession, SUM(j.price) AS totalEarnings
      FROM Profiles p
      INNER JOIN Contracts c ON c.contractorId = p.id
      INNER JOIN Jobs j ON j.contractId = c.id
      WHERE p.type = 'contractor'
        AND j.paid = true
        AND j.paymentDate BETWEEN :startDate AND :endDate
      GROUP BY p.profession
      ORDER BY totalEarnings DESC
      LIMIT 1
    `;

    const [results] = await this.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: 'SELECT',
    });

    return results.length > 0 ? results[0] : { message: 'No data found' };
  }

  // Find the top-paying clients within the given time range
  async getBestClients(startDate: string, endDate: string, limit: number = 2) {
    const query = `
      SELECT p.id as id, p.firstName || ' ' || p.lastName AS clientName, SUM(j.price) AS totalPaid
      FROM Profiles p
      INNER JOIN Contracts c ON c.clientId = p.id
      INNER JOIN Jobs j ON j.contractId = c.id
      WHERE p.type = 'client'
        AND j.paid = true
        AND j.paymentDate BETWEEN :startDate AND :endDate
      GROUP BY p.id
      ORDER BY totalPaid DESC
      LIMIT :limit
    `;

    const [results] = await this.sequelize.query(query, {
      replacements: { startDate, endDate, limit },
      type: 'SELECT',
    });

    return results.length > 0 ? results : { message: 'No data found' };
  }
}
