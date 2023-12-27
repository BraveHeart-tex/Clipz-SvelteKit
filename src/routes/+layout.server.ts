import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';
import registerSchema from '$lib/schemas/RegisterSchema';
import { loginSchema } from '$lib/schemas/LoginSchema';

export const load = (async ({ url, locals }) => {
  // TODO: If we have a user, we dont have to validate call superValidate
  const [loginForm, registerForm] = await Promise.all([
    superValidate(loginSchema),
    superValidate(registerSchema)
  ]);

  const session = await locals.auth.validate();

  return {
    url: url.pathname,
    regsiterForm: registerForm,
    loginForm: loginForm,
    user: session?.user,
    session: session
  };
}) satisfies LayoutServerLoad;
