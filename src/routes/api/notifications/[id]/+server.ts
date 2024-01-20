import prisma from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ locals, params }) => {
  const session = await locals.auth.validate();

  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  if (!id) {
    return json({ error: 'No notification ID was provided.' }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: {
        id,
        user_id: session.user.userId
      }
    });

    if (!notification) {
      return json({ error: 'Notification not found' }, { status: 404 });
    }

    await prisma.notification.update({
      where: {
        id
      },
      data: {
        read_date: new Date()
      }
    });

    return json(
      { message: 'Successfully updated notification.' },
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
