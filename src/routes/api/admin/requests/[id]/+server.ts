import { VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const PUT: RequestHandler = async ({ params, locals, request }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const videoRequestId = params.id;

  if (!videoRequestId) {
    return json(
      { error: 'You must provide a valida video id.' },
      { status: 400 }
    );
  }
  const body = await request.json();
  const { status } = body;

  if (!(status in VideoStatus)) {
    const labels = Object.keys(VideoStatus).join(', ');
    return json(
      { error: `Invalid video status. Valida options are : ${labels}` },
      {
        status: 400
      }
    );
  }

  const result = await prisma.video.update({
    where: {
      id: videoRequestId
    },
    data: {
      status
    }
  });

  if (result) {
    return json(
      { message: 'Video status updated successfully.' },
      { status: 200 }
    );
  } else {
    return json({ error: 'Something went wrong.' }, { status: 500 });
  }
};
