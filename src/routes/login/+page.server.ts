import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas/LoginSchema';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session) {
    throw redirect(303, '/');
  }
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, loginSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { email, password } = form.data;
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: Handle auth
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return setError(form, 'email', 'Email already exists');
        }
      }

      return fail(500, {
        message:
          'Something went wrong while registering the user. Please try again later.'
      });
    }

    return { form };
  }
};
