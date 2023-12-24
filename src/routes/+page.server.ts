import { LoginSchema } from '$lib/schemas/LoginSchema.js';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
  const form = await superValidate(event, LoginSchema);
  return {
    form
  };
};

export const actions = {};
