import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import userService from '$/src/lib/services/user-service';
import { notificationSettingsService } from '$/src/lib/services/notification-settings-service';

export const load: PageServerLoad = async ({ locals, cookies, depends }) => {
  const session = await locals.auth.validate();

  depends('app:settings');
  if (!session) {
    throw redirect(303, '/');
  }

  const theme = cookies.get('colorTheme');

  const { name, profilePicture } = session.user;

  const notificationSettings = await notificationSettingsService.getOne({
    where: {
      user_id: session.user.userId
    }
  });

  return {
    theme: theme || '',
    notificationAllowed: notificationSettings?.allow_notifications,
    mentionNotificationAllowed:
      notificationSettings?.allow_mention_notification,
    reactionNotificationAllowed:
      notificationSettings?.allow_reaction_notification,
    username: name,
    profilePicture
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
  },
  profilePicture: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    if (!session) {
      throw redirect(303, '/');
    }

    const body = await request.json();
    const { profilePicture, deletePicture } = body;

    if (deletePicture) {
      await userService.update(session.user.userId, {
        profile_picture: null
      });

      return {
        success: true
      };
    }

    if (typeof profilePicture !== 'string' && !profilePicture) {
      return fail(400, {
        error: 'invalid_request'
      });
    }

    try {
      await userService.update(session.user.userId, {
        profile_picture: profilePicture
      });

      return {
        success: true
      };
    } catch (error) {
      console.error(error);
      return fail(500, {
        error: 'Something went wrong while updating your profile picture'
      });
    }
  }
};
