import type { Prisma } from '@prisma/client';
import dbService, { DbService } from './db-service';

export class TicketService {
  constructor(private dbService: DbService) {}

  async getMany(args: Prisma.TicketFindManyArgs) {
    return this.dbService.ticket.findMany(args);
  }
}

export const ticketService = new TicketService(dbService);
