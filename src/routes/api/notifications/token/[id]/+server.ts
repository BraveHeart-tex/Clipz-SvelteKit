import prisma from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json(
      {
        error: 'Unauthorized'
      },
      {
        status: 401
      }
    );
  }

  const token = params.id;

  if (!token) {
    return json(
      {
        error: 'No token was provided.'
      },
      {
        status: 400
      }
    );
  }

  try {
    await prisma.fCM_Token.delete({
      where: {
        id: token
      }
    });

    return json(
      {
        message: 'Successfully deleted FCM token'
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error(error);
    return json(
      {
        error: 'Something went wrong. Please try again later'
      },
      {
        status: 500
      }
    );
  }
};
