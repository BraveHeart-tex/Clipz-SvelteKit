import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { VideoStatus } from '@prisma/client';
import { videoService } from '$/src/lib/services/video-service';
import { ticketService } from '$/src/lib/services/ticket-service';

export const load = (async ({ locals, depends }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, '/');
  }

  depends('app:admin');

  if (!session.user.isAdmin) {
    throw redirect(302, '/');
  }

  const pendingRequests = await videoService.getMany({
    where: {
      status: VideoStatus.PENDING_REVIEW
    }
  });

  const openTickets = await ticketService.getMany({});

  return {
    pendingRequests,
    openTickets
  };
}) satisfies PageServerLoad;
