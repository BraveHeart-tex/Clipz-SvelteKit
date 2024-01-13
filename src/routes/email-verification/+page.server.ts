import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

export const load = (async ({ locals, url }) => {
  try {
    const session = await locals.auth.validate();

    if (session?.user.userId || session?.user.emailVerified) {
      throw redirect(302, '/');
    }

    const encodedEmail = url.searchParams.get('email');

    if (!encodedEmail) {
      throw redirect(302, '/');
    }

    const email = atob(encodedEmail);

    const emailValidationResult = z.string().email().safeParse(email);

    if (!email || !emailValidationResult.success) {
      throw redirect(302, '/');
    }

    return {
      email
    };
  } catch (error) {
    console.error(error);
    throw redirect(302, '/');
  }
}) satisfies PageServerLoad;
