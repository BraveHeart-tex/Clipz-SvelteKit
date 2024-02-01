import type { Prisma } from '@prisma/client';
import type { DbService } from './db-service';
import dbService from './db-service';

export class NotificationService {
  constructor(private dbService: DbService) {}

  async getOne(id: string) {
    const notification = await this.dbService.notification.findUnique({
      where: {
        id
      }
    });

    return notification;
  }

  async getMany(args: Prisma.NotificationFindManyArgs) {
    return this.dbService.notification.findMany(args);
  }

  async create(data: Prisma.NotificationUncheckedCreateInput) {
    return this.dbService.notification.create({
      data
    });
  }

  async delete(id: string) {
    return this.dbService.notification.delete({
      where: {
        id
      }
    });
  }

  async update(id: string, data: Prisma.NotificationUpdateInput) {
    return this.dbService.notification.update({
      where: {
        id
      },
      data
    });
  }
}

export const notificationService = new NotificationService(dbService);
