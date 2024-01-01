import { VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const videoRequestId = params.id;

  console.log(videoRequestId);

  const result = await prisma?.video.update({
    where: {
      id: videoRequestId
    },
    data: {
      status: VideoStatus.REJECTED
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

// export const PUT: RequestHandler = async ({ url, locals }) => {
//   const session = await locals.auth.validate();
//   if (!session) {
//     return json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   if (!session.user.isAdmin) {
//     return json({ error: 'Unauthorized' }, { status: 401 });
//   }
// };
