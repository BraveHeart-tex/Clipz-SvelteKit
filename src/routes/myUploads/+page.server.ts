import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import myUploadsService from '$/src/lib/services/myUplodas-service';

export const load: PageServerLoad = async ({ locals, url, depends }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(302, '/');
  }

  depends('app:myVideos');

  const searchParams = url.searchParams;

  const searchQuery = searchParams.get('q') || '';

  const page = searchParams.get('page') || 1;
  const pageSize = 12;
  const skipAmount = (Number(page) - 1) * pageSize;

  const userUploads = await myUploadsService.getAll({
    skip: skipAmount,
    take: pageSize,
    where: {
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
      ],
      created_at: {}
    },
    orderBy: {
      id: 'desc'
    }
  });

  return {
    userUploads,
    hasNextPage: userUploads?.length === pageSize,
    hasPreviousPage: Number(page) > 1,
    currentPage: Number(page),
    totalPageCount: userUploads ? Math.ceil(userUploads.length / pageSize) : 0
  };
};
