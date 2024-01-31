import type { Prisma } from '@prisma/client';
import type { DbService } from './db-service';
import dbService from './db-service';

class MyUploadsService {
  constructor(private dbService: DbService) {}

  async getMany(args?: Prisma.VideoFindManyArgs) {
    return this.dbService.video.findMany(args);
  }

  async create(data: Prisma.VideoCreateArgs) {
    return this.dbService.video.create(data);
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
}

const myUploadsService = new MyUploadsService(dbService);

export default myUploadsService;
