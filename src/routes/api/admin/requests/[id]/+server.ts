import { VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { sendNotification } from '$lib/server/admin';

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

  if (status === VideoStatus.REJECTED && !body.rejectionReason) {
    return json(
      { error: 'You must provide a rejection reason.' },
      { status: 400 }
    );
  }

  const queryData: {
    status: VideoStatus;
    rejectionReason?: string;
  } = {
    status
  };

  if (status === VideoStatus.REJECTED) {
    queryData.rejectionReason = body.rejectionReason;
  }

  const result = await prisma.video.update({
    where: {
      id: videoRequestId
    },
    data: queryData
  });

  if (status === VideoStatus.REJECTED) {
    const user = await prisma.user.findUnique({
      where: {
        id: result.user_id
      }
    });

    if (!user || !user.allow_notifications) {
      return json(
        { message: 'Video status updated successfully.' },
        { status: 200 }
      );
    }

    // send notification to the user
    const registeredTokens = await prisma.fCM_Token.findMany({
      where: {
        user_id: result.user_id
      }
    });

    try {
      const createdNotification = await prisma.notification.create({
        data: {
          title: 'Video Rejected',
          description: `Your video (${result.title}) has been rejected. Reason: ${body.rejectionReason}`,
          user_id: result.user_id
        }
      });

      const message = {
        data: {
          title: 'Video Rejected',
          body: `Your video (${result.title}) has been rejected. Reason: ${body.rejectionReason}`,
          notificationObject: JSON.stringify({
            ...createdNotification,
            is_read: 0
          })
        },
        tokens: registeredTokens.map((token) => token.id)
      };

      await sendNotification({
        message,
        isMultiple: true
      });

      return json(
        { message: 'Video status updated successfully.' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending notification to tokens', error);
      return json(
        { message: 'Video status updated successfully.' },
        { status: 200 }
      );
    }
  }

  if (result) {
    return json(
      { message: 'Video status updated successfully.' },
      { status: 200 }
    );
  } else {
    return json({ error: 'Something went wrong.' }, { status: 500 });
  }
};
