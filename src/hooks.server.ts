import { authenticateUser } from '$lib';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = await authenticateUser(event);

  const response = await resolve(event);

  return response;
};
