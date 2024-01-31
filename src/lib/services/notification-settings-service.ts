import type { Prisma } from '@prisma/client';
import type { DbService } from './db-service';
import dbService from './db-service';

export class NotificationSettingsService {
  constructor(private dbService: DbService) {}

  async create(data: Prisma.NotificationSettingsUncheckedCreateInput) {
    return await this.dbService.notificationSettings.create({
      data
    });
  }
}

export const notificationSettingsService = new NotificationSettingsService(
  dbService
);
