import type { Prisma } from '@prisma/client';
import dbService, { DbService } from './db-service';

export class VideoService {
  constructor(private dbService: DbService) {}

  async getMany(args?: Prisma.VideoFindManyArgs) {
    return this.dbService.video.findMany(args);
  }

  async create(data: Prisma.VideoUncheckedCreateInput) {
    return this.dbService.video.create({
      data
    });
  }

  async delete(id: string) {
    return this.dbService.video.delete({
      where: {
        id
      }
    });
  }

  async update(args: Prisma.VideoUpdateArgs) {
    return this.dbService.video.update(args);
  }

  async getOne(args: Prisma.VideoFindUniqueArgs) {
    return this.dbService.video.findUnique(args);
  }

  async getCount(args: Prisma.VideoCountArgs) {
    return this.dbService.video.count(args);
  }
}

export const videoService = new VideoService(dbService);
