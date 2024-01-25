import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
import { videoRepository } from '$/src/lib/repository/video-repository';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(302, '/');
  }

  const videoId = url.searchParams.get('videoId');
  if (videoId) {
    const video = await videoRepository.getVideo(videoId);

    if (!video) {
      throw redirect(302, '/');
    }

    const form = await superValidate(
      {
        title: video.title,
        description: video.description || ''
      },
      uploadVideoSchema
    );

    return {
      form,
      currentVideo: video
    };
  }

  const form = await superValidate(uploadVideoSchema);

  return {
    form
  };
};

export const actions: Actions = {
  uploadVideo: async ({ request, locals }) => {
    const session = await locals.auth.validate();

    if (!session) {
      throw redirect(302, '/');
    }

    const formData = await request.formData();

    const form = await superValidate(formData, uploadVideoSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { title, description } = form.data;
      const userId = session.user.userId;

      const url = formData.get('videoUrl') as string;
      const poster_url = formData.get('thumbnailUrl') as string;

      await videoRepository.createVideo({
        title,
        description,
        user_id: userId,
        url,
        poster_url
      });
    } catch (error) {
      console.error(error);
      return fail(500, {
        message:
          'Something went wrong while uploading the video. Please try again later.'
      });
    }

    return { form };
  },
  updateVideo: async ({ request, locals }) => {
    const session = await locals.auth.validate();

    if (!session) {
      throw redirect(302, '/');
    }

    const formData = await request.formData();

    const form = await superValidate(formData, uploadVideoSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { title, description } = form.data;

      const url = formData.get('videoUrl') as string;
      const poster_url = formData.get('thumbnailUrl') as string;

      const id = formData.get('videoId') as string;
      await videoRepository.updateVideo(id, {
        title,
        description,
        url,
        poster_url
      });
    } catch (error) {
      console.error(error);
      return fail(500, {
        message:
          'Something went wrong while updating the video. Please try again later.'
      });
    }
  }
};
