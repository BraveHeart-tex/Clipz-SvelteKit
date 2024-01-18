import { VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { adminMessaging } from '$lib/server/admin';

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

    const message = {
      data: {
        title: 'Video Rejected',
        body: `Your video has been rejected. Reason: ${body.rejectionReason}`
      },
      tokens: registeredTokens.map((token) => token.id)
    };

    adminMessaging.sendEachForMulticast(message).then(
      (response) => {
        if (response.failureCount > 0) {
          console.log('Failed to send notification to some tokens', response);
        }
      },
      (error) => {
        console.log('Error sending notification to tokens', error);
      }
    );
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
