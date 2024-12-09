import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { emailConfig } from '@/config/email';
import { Logger } from '@/core/utils/logger';
import { InternalServerError } from '@/core/exceptions';
import { EmailOptions } from '@/core/interfaces/email-options.interface';

export class EmailService {
  private templateCache = new Map<string, Handlebars.TemplateDelegate>();

  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.EMAIL_HOST,
      port: emailConfig.EMAIL_PORT,
      secure: emailConfig.EMAIL_SECURE,
      ...(emailConfig.EMAIL_USER && emailConfig.EMAIL_PASS
        ? {
            auth: {
              user: emailConfig.EMAIL_USER,
              pass: emailConfig.EMAIL_PASS,
            },
          }
        : {}),
    });
  }

  private async loadTemplate(templateName: string): Promise<Handlebars.TemplateDelegate> {
    try {
      if (this.templateCache.has(templateName)) {
        return this.templateCache.get(templateName)!;
      }

      const templatePath = path.join(__dirname, '../templates/email', `${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);

      this.templateCache.set(templateName, template);
      return template;
    } catch (error) {
      throw new InternalServerError(
        EmailService.name,
        `Error loading template: ${templateName}`,
        error as Error
      );
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, string | number>
  ): Promise<string> {
    try {
      const template = await this.loadTemplate(templateName);
      return template(context);
    } catch (error) {
      throw new InternalServerError(
        EmailService.name,
        `Error rendering template: ${templateName}`,
        error as Error
      );
    }
  }

  public async sendEmail(emailOptions: EmailOptions): Promise<void> {
    try {
      const html = await this.renderTemplate(emailOptions.template, emailOptions.context);

      const mailOptions: SendMailOptions = {
        from: emailOptions.from ?? emailConfig.EMAIL_FROM,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html,
        ...(emailOptions.attachments && { attachments: emailOptions.attachments }),
      };

      await this.transporter.sendMail(mailOptions);
      Logger.info(
        `Email sent successfully to '${emailOptions.to}' with template '${emailOptions.template}'`
      );
    } catch (error) {
      throw new InternalServerError(
        EmailService.name,
        `Failed to send email to ${emailOptions.to}`,
        error as Error
      );
    }
  }
}
