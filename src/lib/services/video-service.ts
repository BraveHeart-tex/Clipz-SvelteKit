import {
  videoRepository,
  type VideoRepositoryType
} from '$/src/lib/repository/video-repository';
import type { Prisma, Video } from '@prisma/client';
import { deleteObject, ref, type FirebaseStorage } from 'firebase/storage';
import { storage } from '../firebase';
import { getFirebaseStoragePath } from '..';

class VideoService {
  constructor(
    private videoRepository: VideoRepositoryType,
    private firebaseStorage: FirebaseStorage
  ) {}

  async getVideoById(id: string) {
    return await this.videoRepository.getOne(id);
  }

  async createVideo(data: Prisma.VideoUncheckedCreateInput) {
    return await this.videoRepository.create(data);
  }

  async updateVideo(id: string, data: Prisma.VideoUpdateInput) {
    return await this.videoRepository.update(id, data);
  }

  async deleteVideo(id: string) {
    return await this.videoRepository.delete(id);
  }
}

export const videoService = new VideoService(videoRepository, storage);
export type VideoServiceType = typeof videoService;
