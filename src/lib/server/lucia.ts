import { lucia } from 'lucia';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import prisma from '$lib/server/prisma';
import type { User } from '@prisma/client';

export const auth = lucia({
  adapter: prismaAdapter(prisma, {
    user: 'user',
    key: 'key',
    session: 'session'
  }),
  env: dev ? 'DEV' : 'PROD',
  getUserAttributes: (user: User) => {
    return {
      userId: user.id,
      name: user.name,
      email: user.email
    };
  }
});

export type Auth = typeof auth;
