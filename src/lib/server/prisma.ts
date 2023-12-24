import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (env.NODE_ENV !== 'production') globalThis.prisma = prisma;
