import { json, type RequestHandler } from '@sveltejs/kit';
import userService from '$/src/lib/services/user-service';
import { fcmService } from '$/src/lib/services/fcm-token-service';
import { notificationSettingsService } from '$/src/lib/services/notification-settings-service';

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token } = await request.json();

  if (!token) {
    return json({ error: 'No token was provided.' }, { status: 400 });
  }

  try {
    const existingToken = await fcmService.getOne(token);

    if (existingToken) {
      await fcmService.update({
        where: {
          id: token
        },
        data: {
          valid_till: Date.now() + 5184000000
        }
      });
      return json(
        { message: 'Successfully updated notification permissions.' },
        { status: 200 }
      );
    }

    await fcmService.create({
      data: {
        user_id: session.user.userId,
        id: token,
        valid_till: Date.now() + 5184000000
      }
    });

    await notificationSettingsService.update({
      where: {
        user_id: session.user.userId
      },
      data: {
        allow_notifications: true
      }
    });

    return json(
      { message: 'Successfully updated notification permissions.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Something went wrong. Please try again later' },
      { status: 500 }
    );
  }
};

export const PUT: RequestHandler = async ({ locals, request }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key, value } = await request.json();

  if (!key) {
    return json(
      { error: 'No notification key was provided.' },
      { status: 400 }
    );
  }

  try {
    await userService.update(session.user.userId, {
      [key]: !!value
    });

    return json(
      { message: 'Successfully updated notification permissions.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Something went wrong. Please try again later' },
      { status: 500 }
    );
  }
};

export const DELETE: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fcmService.deleteMany({
      where: {
        user_id: session.user.userId
      }
    });

    await notificationSettingsService.update({
      where: {
        user_id: session.user.userId
      },
      data: {
        allow_notifications: false,
        allow_mention_notification: false,
        allow_reaction_notification: false
      }
    });

    return json(
      { message: 'Successfully updated notification permissions.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Something went wrong. Please try again later' },
      { status: 500 }
    );
  }
};
