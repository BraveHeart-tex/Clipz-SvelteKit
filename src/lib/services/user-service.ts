import type { Prisma } from '@prisma/client';
import type { DbService } from './db-service';
import dbService from './db-service';

export class UserService {
  constructor(private dbService: DbService) {}

  async getMany() {
    return await this.dbService.user.findMany();
  }

  async getOne(id: string) {
    return await this.dbService.user.findUnique({
      where: {
        id
      }
    });
  }

  async getByEmail(email: string) {
    return await this.dbService.user.findUnique({
      where: {
        email
      }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.dbService.user.create({
      data
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.dbService.user.update({
      where: {
        id
      },
      data
    });
  }

  async delete(id: string) {
    return await this.dbService.user.delete({
      where: {
        id
      }
    });
  }
}

const userService = new UserService(dbService);

export default userService;
