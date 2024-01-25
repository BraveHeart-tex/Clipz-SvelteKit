import type { Prisma, Video } from '@prisma/client';
import prisma from '../server/prisma';

class VideoRepository {
  async getVideo(id: string): Promise<Video | null> {
    try {
      const video = await prisma.video.findUnique({
        where: {
          id
        }
      });

      return video;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createVideo(data: Prisma.VideoUncheckedCreateInput) {
    try {
      const video = await prisma.video.create({
        data
      });

      return video;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateVideo(id: string, data: Prisma.VideoUpdateInput) {
    try {
      const video = await prisma.video.update({
        where: {
          id
        },
        data
      });

      return video;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteVideo(id: string) {
    try {
      const video = await prisma.video.delete({
        where: {
          id
        }
      });

      return video;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const videoRepository = new VideoRepository();
