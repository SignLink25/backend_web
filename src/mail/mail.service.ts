import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Código de verificação SignLink',
      template: 'verificationCode',
      context: {
        name: user.username,
        token: user.token,
      },
    });
  }
}
