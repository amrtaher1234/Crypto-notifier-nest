import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendResourceMailDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailForResouce(sendResourceMail: SendResourceMailDto) {
    const { quotes, userEmail } = sendResourceMail;
    await this.mailerService.sendMail({
      to: userEmail,
      subject: `Your subscribed resources (${quotes
        .map((quote) => quote.shortName)
        .join(', ')}) has been changed!`,
      template: './resource',
      context: {
        ...sendResourceMail,
      },
    });
  }
  async sendMail() {
    await this.mailerService.sendMail({
      to: 'amrtaher1995@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './test',
      context: {
        name: 'Ahmed',
      },
    });
  }
}
