import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

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
    await prisma.fCM_Token.create({
      data: {
        user_id: session.user.userId,
        id: token
      }
    });

    await prisma.user.update({
      where: {
        id: session.user.userId
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
    await prisma.user.update({
      where: {
        id: session.user.userId
      },
      data: {
        [key]: !!value
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

export const DELETE: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.fCM_Token.deleteMany({
      where: {
        user_id: session.user.userId
      }
    });

    await prisma.user.update({
      where: {
        id: session.user.userId
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