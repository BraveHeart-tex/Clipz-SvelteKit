import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import type { DbService } from './db-service';
import dbService from './db-service';

interface IEmailVerificationService {
  generateEmailVerificationToken: (userId: string) => Promise<string>;
  validateEmailVerificationToken: (token: string) => Promise<string>;
}

class EmailVerificationService implements IEmailVerificationService {
  constructor(private dbService: DbService) {}

  private EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

  async generateEmailVerificationToken(userId: string) {
    const storedUserTokens =
      await this.dbService.email_Verification_Token.findMany({
        where: {
          user_id: userId
        }
      });
    if (storedUserTokens.length > 0) {
      const reusableStoredToken = storedUserTokens.find((token) => {
        // check if expiration is within 1 hour
        // and reuse the token if true
        return isWithinExpiration(Number(token.expires) - this.EXPIRES_IN / 2);
      });
      if (reusableStoredToken) return reusableStoredToken.id;
    }
    const token = generateRandomString(63);

    await this.dbService.email_Verification_Token.create({
      data: {
        id: token,
        expires: new Date().getTime() + this.EXPIRES_IN,
        user_id: userId
      }
    });

    return token;
  }

  async validateEmailVerificationToken(token: string) {
    const storedToken = await this.dbService.$transaction(async (trx) => {
      const storedToken = await trx.email_Verification_Token.findUnique({
        where: {
          id: token
        }
      });
      if (!storedToken) throw new Error('Invalid token');
      await trx.email_Verification_Token.delete({
        where: {
          id: token,
          user_id: storedToken.user_id
        }
      });
      return storedToken;
    });
    const tokenExpires = Number(storedToken.expires);
    if (!isWithinExpiration(tokenExpires)) {
      throw new Error('Expired token');
    }
    return storedToken.user_id;
  }
}

export const emailVerificationService = new EmailVerificationService(dbService);
