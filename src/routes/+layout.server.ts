import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';
import registerSchema from '$lib/schemas/RegisterSchema';
import { loginSchema } from '$lib/schemas/LoginSchema';

export const load = (async ({ url }) => {
  const [loginForm, registerForm] = await Promise.all([
    superValidate(loginSchema),
    superValidate(registerSchema)
  ]);
  return {
    url: url.pathname,
    regsiterForm: registerForm,
    loginForm: loginForm
  };
}) satisfies LayoutServerLoad;
