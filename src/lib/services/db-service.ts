import { PrismaClient } from '@prisma/client';

export class DbService extends PrismaClient {
  constructor() {
    super();
  }
}

const dbService = new DbService();
dbService.$connect();

export default dbService;
