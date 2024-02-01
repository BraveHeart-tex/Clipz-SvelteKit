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

  async update(args: Prisma.FCM_TokenUpdateArgs) {
    return this.dbService.fCM_Token.update(args);
  }

  async create(args: Prisma.FCM_TokenCreateArgs) {
    return this.dbService.fCM_Token.create(args);
  }

  async deleteMany(args: Prisma.FCM_TokenDeleteManyArgs) {
    return this.dbService.fCM_Token.deleteMany(args);
  }

  async delete(args: Prisma.FCM_TokenDeleteArgs) {
    return this.dbService.fCM_Token.delete(args);
  }
}

export const fcmService = new FcmService(dbService);
