import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_USER,
  ORIGIN
} from '$env/static/private';
import nodemailer from 'nodemailer';

interface IEmailSenderService {
  sendEmailVerificationLink: (email: string, token: string) => Promise<boolean>;
  sendResetPasswordLink: (email: string, token: string) => Promise<boolean>;
}

class EmailSenderService implements IEmailSenderService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  }

  async sendEmailVerificationLink(email: string, token: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD
        }
      });

      const verificationLink = ORIGIN + `/email-verification/${token}`;

      await transporter.sendMail({
        from: 'Clipz <no-reply@clipz.borakaraca.tech>',
        to: email,
        subject: 'Verify your email address',
        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333333; font-weight:500;">Email Verification</h2>
                <p style="color: #666666;">Thank you for registering to ClipZ! To complete your registration, please click the link below:</p>
                <a href="${verificationLink}" style="display: block; margin-top: 20px; padding: 10px; background-color: #d20449; color: #ffffff; text-align: center; text-decoration: none; border-radius: 8px; font-weight:600">Verify Email</a>
                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eeeeee; text-align: center; color: #888888;">
                    <p>If you didn't sign up for this service, you can safely ignore this email.</p>
                </div>
            </div>
        </body>`
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sendResetPasswordLink(email: string, token: string) {
    try {
      const resetPasswordLink = ORIGIN + `/forgot-password/${token}`;

      await this.transporter.sendMail({
        from: 'Clipz <no-reply@clipz.borakaraca.tech>',
        to: email,
        subject: 'Reset your password',
        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333333; font-weight:500;">Password Reset</h2>
                <p style="color: #666666;">We received a request to reset your password. To proceed, click the link below:</p>
                <a href="${resetPasswordLink}" style="display: block; margin-top: 20px; padding: 10px; background-color: #d20449; color: #ffffff; text-align: center; text-decoration: none; border-radius: 8px; font-weight:600">Reset Password</a>
                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eeeeee; text-align: center; color: #888888;">
                    <p>If you didn't initiate this password reset, please ignore this email.</p>
                </div>
            </div>
        </body>`
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export const emailSenderService = new EmailSenderService();
