import { User } from '@/entities/user.entity';
import { AuthToken } from '@/entities/auth-token.entity';
import { VerificationToken } from '@/entities/verification-token.entity';
import { Document } from '@/entities/document.entity';
import { DocumentSigner } from '@/entities/document-signer.entity';
import { DocumentActivity } from '@/entities/document-activity.entity';
import { DocusignIntegration } from '@/entities/docusign-integration.entity';

export const entities = [
  User,
  AuthToken,
  VerificationToken,
  DocusignIntegration,
  Document,
  DocumentSigner,
  DocumentActivity,
];
