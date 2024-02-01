import type { Prisma } from '@prisma/client';
import dbService, { DbService } from './db-service';

export class FcmService {
  constructor(private dbService: DbService) {}

  async getOne(id: string) {
    return this.dbService.fCM_Token.findUnique({
      where: {
        id
      }
    });
  }

  async getMany(args: Prisma.FCM_TokenFindManyArgs) {
    return this.dbService.fCM_Token.findMany(args);
  }
}

export const fcmService = new FcmService(dbService);
