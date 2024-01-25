import { emailSenderService } from '$/src/lib/services/email-sender-service';
import { emailVerificationService } from '$/src/lib/services/email-verification-service';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(303, '/');

  const { email } = await request.json();

  const validationResult = z.string().email().safeParse(email);

  if (!validationResult.success)
    return json({ error: validationResult.error }, { status: 400 });

  try {
    const user = await prisma?.user.findUnique({ where: { email } });

    if (!user)
      return json(
        { error: 'User not found with the given email.' },
        { status: 404 }
      );

    const token = await emailVerificationService.generateEmailVerificationToken(
      user.id
    );

    const emailResult = await emailSenderService.sendEmailVerificationLink(
      email,
      token
    );

    if (emailResult)
      return json(
        { message: 'Verification email sent successfully.' },
        { status: 200 }
      );
    else return json({ error: 'Something went wrong.' }, { status: 500 });
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Something went wrong while processing the request' },
      { status: 500 }
    );
  }
};
