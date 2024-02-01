import { videoService } from '$/src/lib/services/video-service';
import { VideoStatus, type Prisma } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchQuery = url.searchParams.get('q');
  const sortColumn = url.searchParams.get('sortCol');
  const sortDirection = url.searchParams.get('sortDir');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const filters = JSON.parse(url.searchParams.get('colFilters') || '{}');

  const whereCondition: Prisma.VideoWhereInput = {
    status: VideoStatus.PENDING_REVIEW
  };

  // global search
  if (searchQuery) {
    whereCondition.OR = [
      { title: { contains: searchQuery.toLowerCase() } },
      { description: { contains: searchQuery.toLowerCase() } }
    ];
  }

  // column filters
  if (filters.title) {
    whereCondition.title = { contains: filters.title.toLowerCase() };
  }

  if (filters.description) {
    whereCondition.description = {
      contains: filters.description.toLowerCase()
    };
  }

  if (filters.url) {
    whereCondition.url = { contains: filters.url.toLowerCase() };
  }

  // sort
  const orderBy: Record<string, unknown> = {};
  if (sortColumn) {
    orderBy[sortColumn] = sortDirection;
  }

  // pagination
  const skip = (page - 1) * pageSize;

  const result = await videoService.getMany({
    where: whereCondition,
    orderBy,
    skip,
    take: pageSize
  });

  // TODO: add to videoService
  const total = await prisma?.video.count({ where: whereCondition });

  return json({
    rows: result,
    count: total
  });
};
