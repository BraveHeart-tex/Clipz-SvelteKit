import { storage } from '$lib/firebase';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { ref, deleteObject } from 'firebase/storage';

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

  const result = await prisma?.video.delete({
    where: {
      id: videoId
    }
  });

  if (!result) {
    return json(
      {
        message: `Video with id ${videoId} not found.`
      },
      { status: 404 }
    );
  }

  // delete from storage
  const videoStorageRef = ref(storage, result.url);
  const thumbnailStorageRef = ref(storage, result.poster_url);

  await Promise.all([
    deleteObject(videoStorageRef),
    deleteObject(thumbnailStorageRef)
  ]);

  return json({ message: `Video deleted successfully.` }, { status: 200 });
};
