import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(303, '/');
  }

  const theme = cookies.get('colorTheme');

  return {
    theme: theme || ''
  };
};

export const actions: Actions = {
  setTheme: async ({ url, cookies }) => {
    const theme = url.searchParams.get('theme');
    if (theme) {
      cookies.set('colorTheme', theme, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      });
    }
  }
};
