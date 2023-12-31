import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
import { storage } from '$lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

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
      console.log(form.data);

      const { title, description, file } = form.data;
      const userId = session.user.userId;

      // upload the video to the cloud
      const storageRef = ref(
        storage,
        `videos/${title.replace(/\s/g, '_')}.mp4`
      );

      const result = await uploadBytes(storageRef, file, {
        contentType: 'video/mp4'
      });

      console.log(result.ref.fullPath);

      // after that, save the video to the database with the url and userId
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
