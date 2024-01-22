import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { emailVerificationService } from '$/src/lib/services/email-verification-service';

export const load = (async ({ locals, params, url }) => {
  const session = await locals.auth.validate();

  if (session?.user.userId || session?.user.emailVerified) {
    throw redirect(302, '/');
  }

  const token = params.token;
  if (!token) throw redirect(302, '/');

  try {
    const userId =
      await emailVerificationService.validateEmailVerificationToken(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });

    locals.auth.setSession(session);
  } catch (error) {
    const redirectURL = new URL(url);
    redirectURL.pathname = '/';
    redirectURL.searchParams.set('redirectToLogin', 'true');
    throw redirect(302, redirectURL.toString());
  }

  const successURL = new URL(url);
  successURL.pathname = '/';
  successURL.searchParams.set('emailVerified', 'true');
  throw redirect(302, successURL.toString());
}) satisfies PageServerLoad;
