import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas/LoginSchema';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session) {
    throw redirect(302, '/');
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, loginSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { email, password } = form.data;
      const key = await auth.useKey('email', email, password);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}
      });
      locals.auth.setSession(session);
    } catch (e) {
      console.log(e);

      if (e instanceof LuciaError) {
        if (e.message === 'AUTH_INVALID_PASSWORD') {
          return setError(form, 'email', 'Invalid email or password');
        }
      }

      return fail(500, {
        message:
          'Something went wrong while registering the user. Please try again later.'
      });
    }

    return { form };
  }
};
