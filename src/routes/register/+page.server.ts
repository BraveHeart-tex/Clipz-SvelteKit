import { redirect, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import registerSchema from '$lib/schemas/RegisterSchema';
import { auth } from '$lib/server/lucia';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session) {
    throw redirect(303, '/');
  }

  return {
    form: await superValidate(registerSchema)
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const body = Object.fromEntries(await request.formData()) as Record<
      string,
      string
    >;

    try {
      const validationResult = registerSchema.safeParse(body);
      if (validationResult.success) {
        const { email, password, fullName } = validationResult.data;
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
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return error(400, {
            message: 'Email is already in use.'
          });
        }
      }

      return error(500, {
        message:
          'Something went wrong while registering the user. Please try again later.'
      });
    }

    throw redirect(303, '/login');
  }
};
