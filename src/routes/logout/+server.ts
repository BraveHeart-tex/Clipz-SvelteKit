import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  try {
    const session = await locals.auth.validate();
    if (!session) return redirect(302, '/');
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }

  throw redirect(302, '/');
};
