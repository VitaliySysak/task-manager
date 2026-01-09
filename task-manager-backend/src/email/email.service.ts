import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    try {
      const templatePath = path.join(process.cwd(), 'dist', 'email-templates', 'verify.hbs');

      const source = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(source);

      const html = template({
        code,
        subject: 'Confirm registration',
        frontendUrl: process.env.FRONTEND_URL!,
      });

      await this.transporter.sendMail({
        from: '"Task Manager" <no-reply@task-manager.space>',
        to,
        subject: 'Task Manager - Confirm registration',
        html,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }
}
