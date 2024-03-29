import { firebaseVideoService } from '$/src/lib/services/firebase-video-service';
import { videoService } from '$lib/services/video-service';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(302, '/');
  }

  if (!params.videoId) {
    return json(
      {
        message:
          'Video id is missing. Please provide a valid video id to delete.'
      },
      { status: 400 }
    );
  }

  const videoId = params.videoId;

  const video = await videoService.delete(videoId);

  if (!video) {
    return json(
      {
        message: `Video with id ${videoId} not found.`
      },
      { status: 404 }
    );
  }

  await firebaseVideoService.deleteVideoFromFirebaseStorage({ video });

  return json({ message: `Video deleted successfully.` }, { status: 200 });
};
