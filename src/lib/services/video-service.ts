import type { Video } from '@prisma/client';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../firebase';
import { getFirebaseStoragePath } from '..';

class VideoService {
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

export const videoService = new VideoService();
export type VideoServiceType = typeof videoService;
