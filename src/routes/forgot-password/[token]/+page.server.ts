import { resetPasswordService } from '$lib/services/reset-password-service';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import resetPasswordSchema from '$lib/schemas/ResetPasswordSchema';
import { auth } from '$lib/server/lucia';

export const load = (async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (session) {
    throw redirect(302, '/');
  }

  const token = params.token;

  if (!token) throw redirect(302, '/');

  try {
    const form = await superValidate(resetPasswordSchema);

    return {
      resetPasswordForm: form
    };
  } catch (error) {
    console.error(error);
    throw redirect(302, '/');
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ locals, params, request, url }) => {
    const session = await locals.auth.validate();
    if (session) {
      throw redirect(302, '/');
    }

    const form = await superValidate(request, resetPasswordSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const token = params.token;
    if (!token) return fail(400, { form });

    try {
      const userId =
        await resetPasswordService.validatePasswordResetToken(token);
      let user = await auth.getUser(userId);
      await auth.invalidateAllUserSessions(user.userId);
      await auth.updateKeyPassword('email', user.email!, form.data.password);

      if (!user.emailVerified) {
        user = await auth.updateUserAttributes(user.userId, {
          email_verified: true
        });
      }
      const key = await auth.useKey('email', user.email!, form.data.password);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}
      });
      locals.auth.setSession(session);
    } catch (error) {
      console.error(error);
      return fail(400, {
        error: 'Invalid or expired password reset token.'
      });
    }

    const redirectUrl = new URL(url);
    redirectUrl.pathname = '/';
    redirectUrl.searchParams.set('passwordReset', 'success');

    throw redirect(302, redirectUrl.toString());
  }
};
