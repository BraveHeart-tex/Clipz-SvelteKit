import { redirect } from '@sveltejs/kit';
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
