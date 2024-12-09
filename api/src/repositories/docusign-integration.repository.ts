import { BaseRepository } from '@/repositories/base.repository';
import { DatabaseProvider } from '@/providers/database.provider';
import { DocusignIntegration } from '@/entities/docusign-integration.entity';

export class DocusignIntegrationRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), DocusignIntegration);
  }
}
