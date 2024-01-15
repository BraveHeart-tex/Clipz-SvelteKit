import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies, depends }) => {
  const session = await locals.auth.validate();

  depends('app:settings');
  if (!session) {
    throw redirect(303, '/');
  }

  const theme = cookies.get('colorTheme');

  const {
    allowNotifications,
    allowMentionNotification,
    allowReactionNotification
  } = session.user;

  return {
    theme: theme || '',
    notificationAllowed: allowNotifications,
    mentionNotificationAllowed: allowMentionNotification,
    reactionNotificationAllowed: allowReactionNotification
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
