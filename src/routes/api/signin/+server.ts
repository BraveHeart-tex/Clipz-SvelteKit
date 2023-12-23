import { adminAuth } from '$lib/server/admin';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 5 days

  const decocedIdToken = await adminAuth.verifyIdToken(idToken);

  if (new Date().getTime() / 1000 - decocedIdToken.auth_time < 5 * 60) {
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/'
    };

    cookies.set('__session', cookie, options);

    return json({ status: 'success' });
  } else {
    throw error(401, 'UNAUTHORIZED REQUEST!');
  }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('__session', { path: '/' });
  return json({ status: 'signed out' });
};
