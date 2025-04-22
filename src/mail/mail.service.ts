import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { ResetPassword } from 'src/users/entities/reset-password.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verification Code SignLink',
      template: 'verificationCode',
      context: {
        name: user.username,
        token: user.token,
      },
    });
  }

  async sendUserDelete(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Account Deletion Notice',
      template: 'delete',
      context: {
        name: user.username,
      },
    });
  }

  async sendResetPassword(resetPassword: ResetPassword) {
    await this.mailerService.sendMail({
      to: resetPassword.email,
      subject: 'Reset Password SignLink',
      template: 'reset',
      context: {
        token: `${envs.url_frontend}/reset-password/` + resetPassword.token,
      },
    });
  }
}
