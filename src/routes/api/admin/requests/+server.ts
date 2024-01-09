import type { Prisma, VideoStatus } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = url.searchParams;
  const searchQuery = searchParams.get('q') || '';
  const statusQuery = searchParams.get('status') || '';

  const page = searchParams.get('page') || 1;
  const pageSize = 12;
  const skipAmount = (Number(page) - 1) * pageSize;

  const whereCondition: Prisma.VideoWhereInput = {
    user_id: session.user.userId,
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

  const userUploads = await prisma?.video.findMany({
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
