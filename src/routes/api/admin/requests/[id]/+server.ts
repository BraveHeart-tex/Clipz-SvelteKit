import { VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendNotification } from '$lib/server/admin';
import { videoService } from '$/src/lib/services/video-service';
import userService from '$/src/lib/services/user-service';
import { notificationSettingsService } from '$/src/lib/services/notification-settings-service';
import { notificationService } from '$/src/lib/services/notification-service';
import { fcmService } from '$/src/lib/services/fcm-token-service';

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
    rejection_reason?: string;
  } = {
    status
  };

  if (status === VideoStatus.REJECTED) {
    queryData.rejection_reason = body.rejectionReason;
  }

  const result = await videoService.update({
    where: {
      id: videoRequestId
    },
    data: queryData
  });

  if (status === VideoStatus.REJECTED) {
    const user = await userService.getOne(result.user_id);

    if (!user) {
      return json(
        { message: 'Video status updated successfully.' },
        { status: 200 }
      );
    }

    const notificationPermission = await notificationSettingsService.getOne({
      where: {
        user_id: result.user_id
      }
    });

    if (!notificationPermission?.allow_notifications) {
      return json(
        {
          message: 'Video status updated successfully.'
        },
        {
          status: 200
        }
      );
    }

    const registeredTokens = await fcmService.getMany({
      where: {
        user_id: result.user_id
      }
    });

    try {
      const createdNotification = await notificationService.create({
        title: 'Video Rejected',
        description: `Your video (${result.title}) has been rejected. Reason: ${body.rejectionReason}`,
        user_id: result.user_id
      });

      const message = {
        data: {
          title: 'Video Rejected',
          body: `Your video (${result.title}) has been rejected. Reason: ${body.rejectionReason}`,
          notificationObject: JSON.stringify(createdNotification)
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
