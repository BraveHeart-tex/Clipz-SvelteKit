import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(302, '/');
  }

  const form = await superValidate(uploadVideoSchema);

  return {
    form
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const session = await locals.auth.validate();

    if (!session) {
      throw redirect(302, '/');
    }

    const form = await superValidate(request, uploadVideoSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { title, description } = form.data;
      const userId = session.user.userId;
    } catch (error) {
      console.error(error);
      return fail(500, {
        message:
          'Something went wrong while uploading the video. Please try again later.'
      });
    }

    return { form };
  }
};
