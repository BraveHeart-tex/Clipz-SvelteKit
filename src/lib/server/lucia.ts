import { lucia } from 'lucia';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import prisma from '$lib/server/prisma';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
  env: dev ? 'DEV' : 'PROD',
  adapter: prismaAdapter(prisma, {
    user: 'user',
    key: 'key',
    session: 'session'
  }),
  middleware: sveltekit(),
  getUserAttributes: (user) => {
    return {
      userId: user.id,
      name: user.name,
      email: user.email
    };
  }
});

export type Auth = typeof auth;
