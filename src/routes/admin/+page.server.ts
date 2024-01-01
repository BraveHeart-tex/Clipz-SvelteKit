import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { VideoStatus } from '@prisma/client';

export const load = (async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, '/');
  }

  if (!session.user.isAdmin) {
    throw redirect(302, '/');
  }

  const pendingRequests = await prisma?.video.findMany({
    where: {
      status: VideoStatus.PENDING_REVIEW
    }
  });

  const openTickets = await prisma?.ticket.findMany({});

  return {
    pendingRequests,
    openTickets
  };
}) satisfies PageServerLoad;
