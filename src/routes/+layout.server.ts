import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';
import registerSchema from '$lib/schemas/RegisterSchema';
import { loginSchema } from '$lib/schemas/LoginSchema';

export const load = (async ({ url, locals }) => {
  try {
    const session = await locals.auth.validate();
    if (!session) {
      const [loginForm, registerForm] = await Promise.all([
        superValidate(loginSchema),
        superValidate(registerSchema)
      ]);

      return {
        url: url.pathname,
        user: null,
        session: session,
        loginForm,
        registerForm
      };
    }

    const notifications = await prisma?.notification.findMany({
      where: {
        user_id: session.user.userId
      }
    });

    return {
      url: url.pathname,
      user: session?.user,
      session: session,
      notifications: notifications || []
    };
  } catch (error) {
    console.error(error);
    return {
      url: url.pathname,
      user: null,
      session: null
    };
  }
}) satisfies LayoutServerLoad;
