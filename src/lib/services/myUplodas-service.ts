import type { Prisma } from '@prisma/client';
import type { DbService } from './db-service';
import dbService from './db-service';

class MyUploadsService {
  constructor(private dbService: DbService) {}

  async getAll(args?: Prisma.VideoFindManyArgs) {
    return this.dbService.video.findMany(args);
  }
}

const myUploadsService = new MyUploadsService(dbService);

export default myUploadsService;
