import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import forgotPasswordSchema from '$lib/schemas/ForgotPasswordSchema';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');

  const form = superValidate(forgotPasswordSchema);
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
  }
};
