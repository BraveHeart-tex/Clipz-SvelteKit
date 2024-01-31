import userService from '$/src/lib/services/user-service';
import { videoService } from '$/src/lib/services/video-service';
import type { Prisma, VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.userId as string;
  if (!userId || typeof userId !== 'string') {
    return json({ error: 'Invalid user id' }, { status: 400 });
  }

  const user = await userService.getOne(userId);

  if (!user) {
    return json(
      { error: 'User not found with the given id.' },
      { status: 404 }
    );
  }

  const searchParams = url.searchParams;
  const searchQuery = searchParams.get('q') || '';
  const statusQuery = searchParams.get('status') || '';

  const page = searchParams.get('page') || 1;
  const pageSize = 12;
  const skipAmount = (Number(page) - 1) * pageSize;

  const whereCondition: Prisma.VideoWhereInput = {
    user_id: userId,
    OR: [
      {
        title: {
          contains: searchQuery
        }
      },
      {
        description: {
          contains: searchQuery
        }
      }
    ]
  };

  if (statusQuery) {
    whereCondition.status = statusQuery as VideoStatus;
  }

  const userUploads = await videoService.getMany({
    skip: skipAmount,
    take: pageSize,
    where: whereCondition
  });

  return json(
    {
      userUploads,
      hasNextPage: userUploads?.length === pageSize,
      hasPreviousPage: Number(page) > 1,
      currentPage: Number(page),
      totalPageCount: userUploads ? Math.ceil(userUploads.length / pageSize) : 0
    },
    {
      status: 200
    }
  );
};
