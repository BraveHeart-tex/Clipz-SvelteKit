import type { Prisma } from '@prisma/client';
import prisma from '../server/prisma';

class NotificationSettingsRepository {
  constructor() {}
  async create(data: Prisma.NotificationSettingsUncheckedCreateInput) {
    try {
      return await prisma.notificationSettings.create({
        data
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export const notificationSettingsRepository =
  new NotificationSettingsRepository();

export type NotificationSettingsRepositoryType = NotificationSettingsRepository;
