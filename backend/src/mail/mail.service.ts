import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(config: ConfigService) {
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    this.from = config.get<string>('MAIL_FROM') ?? 'Brightloop Software <no-reply@brightloop.com>';
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST') ?? 'localhost',
      port: Number(config.get<string>('SMTP_PORT') ?? 1025),
      secure: false,
      auth: user ? { user, pass } : undefined,
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({ from: this.from, ...options });
    this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
  }

  async sendPasswordReset(to: string, name: string, link: string): Promise<void> {
    const safeName = escapeHtml(name);
    await this.send({
      to,
      subject: 'Reset your Brightloop password',
      text: `Hi ${name},\n\nUse this link to reset your password (valid for 30 minutes, single use):\n${link}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>Hi ${safeName},</p>
<p>We received a request to reset your Brightloop password. This link is valid for <strong>30 minutes</strong> and can be used once.</p>
<p><a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Reset password</a></p>
<p>Or copy this URL into your browser:<br>${link}</p>
<p>If you did not request this, you can safely ignore this email.</p>`,
    });
  }
}
