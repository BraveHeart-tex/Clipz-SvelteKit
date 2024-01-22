import prisma from '../server/prisma';

class NotificationSettingsRepository {
  constructor() {}
  async createNotificationSettings(userId: string) {
    try {
      await prisma.notificationSettings.create({
        data: {
          user_id: userId
        }
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export const notificationSettingsRepository =
  new NotificationSettingsRepository();
