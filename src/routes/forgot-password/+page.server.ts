import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import forgotPasswordSchema from '$lib/schemas/ForgotPasswordSchema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { generatePasswordResetToken } from '$lib/reset-password-token';
import prisma from '$lib/server/prisma';
import { sendResetPasswordLink } from '$lib/email';

export const load = (async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');

  const form = await superValidate(forgotPasswordSchema);
  return {
    forgotPasswordForm: form
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    if (session) throw redirect(302, '/');

    const form = await superValidate(request, forgotPasswordSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const email = form.data.email;
      const storedUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (!storedUser) {
        return setError(form, 'email', 'User with this email does not exist.');
      }

      const resetToken = await generatePasswordResetToken(storedUser.id);
      if (resetToken) {
        await sendResetPasswordLink(email, resetToken);
      }

      return { form };
    } catch (error) {
      console.log(error);
      return fail(500, {
        message:
          'Something went wrong while sending the password reset link. Please try again later.'
      });
    }
  }
};