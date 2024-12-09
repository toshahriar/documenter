import { EmailTemplate } from '@/core/enums/email-template.enum';

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  template: EmailTemplate;
  context: Record<string, string | number>;
  attachments?: Array<{
    filename: string;
    path: string;
    cid?: string;
  }>;
}
