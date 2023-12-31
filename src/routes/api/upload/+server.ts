import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth.validate();

  if (!session) {
    throw redirect(302, '/');
  }

  const formData = await request.formData();

  const form = await superValidate(formData, uploadVideoSchema);

  if (!form.valid) {
    return json(
      { message: 'Invalid form data.' },
      {
        status: 400
      }
    );
  }

  try {
    const { title, description } = form.data;
    const userId = session.user.userId;

    const url = formData.get('videoUrl') as string;
    console.log(url);

    await prisma?.video.create({
      data: {
        title,
        description,
        user_id: userId,
        url
      }
    });

    return json(
      { message: 'Video uploaded successfully.' },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error(error);
    return json(
      { message: 'Something went wrong.' },
      {
        status: 500
      }
    );
  }
};

// export const DELETE: RequestHandler = async ({ cookies }) => {};
