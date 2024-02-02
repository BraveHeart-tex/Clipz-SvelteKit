import type { Video } from '@prisma/client';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../firebase';
import { getFirebaseStoragePath } from '..';

export class FirebaseVideoService {
  constructor() {}

  async deleteVideoFromFirebaseStorage({
    video,
    deleteThumbnail
  }: {
    video: Video;
    deleteThumbnail?: boolean;
  }) {
    try {
      const videoStorageRef = ref(
        storage,
        '/videos/' + getFirebaseStoragePath(video.url)
      );

      const thumbnailStorageRef = ref(
        storage,
        '/thumbnails/' + getFirebaseStoragePath(video.poster_url!)
      );

      await deleteObject(videoStorageRef);

      if (deleteThumbnail) {
        await deleteObject(thumbnailStorageRef);
      }
    } catch (error) {
      console.error(error);
      return {
        error
      };
    }
  }
}

export const firebaseVideoService = new FirebaseVideoService();
