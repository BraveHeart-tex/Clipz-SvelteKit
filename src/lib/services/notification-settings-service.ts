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

  async getOne(args: Prisma.NotificationSettingsFindUniqueArgs) {
    return await this.dbService.notificationSettings.findUnique(args);
  }
}

export const notificationSettingsService = new NotificationSettingsService(
  dbService
);
