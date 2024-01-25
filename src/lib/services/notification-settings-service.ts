import {
  notificationSettingsRepository,
  type NotificationSettingsRepositoryType
} from '$/src/lib/repository/notification-settings-repository';
import type { Prisma } from '@prisma/client';

class NotificationSettingsService {
  constructor(
    private notificationSettingsRepository: NotificationSettingsRepositoryType
  ) {}

  async createNotificationSettings(
    data: Prisma.NotificationSettingsUncheckedCreateInput
  ) {
    return await this.notificationSettingsRepository.create(data);
  }
}

export const notificationSettingsService = new NotificationSettingsService(
  notificationSettingsRepository
);

export type NotificationSettingsServiceType =
  typeof notificationSettingsService;
