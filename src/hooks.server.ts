import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const handle: Handle = async ({ event, resolve }) => {
  let theme: string = 'crimson';
  event.locals.auth = auth.handleRequest(event);

  const newTheme = event.url.searchParams.get('colorTheme');
  const cookieTheme = event.cookies.get('colorTheme');

  if (newTheme) {
    theme = newTheme;
  } else if (cookieTheme) {
    theme = cookieTheme;
  }

  if (theme) {
    return await resolve(event, {
      transformPageChunk({ html }) {
        return html.replace('data-theme=""', `data-theme="${theme}"`);
      }
    });
  }

  return await resolve(event);
};
