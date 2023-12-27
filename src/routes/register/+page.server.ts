import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import registerSchema from '$lib/schemas/RegisterSchema';
import { auth } from '$lib/server/lucia';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session) {
    throw redirect(303, '/');
  }

  const form = await superValidate(registerSchema);

  return {
    form
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, registerSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { email, password, fullName } = form.data;
      const hashedPassword = await bcrypt.hash(password, 10);

      await auth.createUser({
        key: {
          providerId: 'email',
          providerUserId: email.toLowerCase(),
          password: hashedPassword
        },
        attributes: {
          email: email,
          name: fullName,
          hashed_password: hashedPassword
        }
      });
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
