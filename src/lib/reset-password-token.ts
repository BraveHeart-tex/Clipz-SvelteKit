import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import prisma from '$lib/server/prisma';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (userId: string) => {
  try {
    const storedUserTokens = await prisma?.reset_Password_Token.findMany({
      where: {
        user_id: userId
      }
    });
    if (storedUserTokens.length > 0) {
      const reusableStoredToken = storedUserTokens.find((token) => {
        // check if expiration is within 1 hour
        // and reuse the token if true
        return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
      });
      if (reusableStoredToken) return reusableStoredToken.id;
    }
    const token = generateRandomString(63);

    await prisma.reset_Password_Token.create({
      data: {
        id: token,
        expires: new Date().getTime() + EXPIRES_IN,
        user_id: userId
      }
    });
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validatePasswordResetToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.reset_Password_Token.findUnique({
      where: {
        id: token
      }
    });

    if (!storedToken) throw new Error('Invalid token');

    await trx.reset_Password_Token.delete({
      where: {
        id: storedToken.id
      }
    });

    return storedToken;
  });
  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error('Expired token');
  }
  return storedToken.user_id;
};
