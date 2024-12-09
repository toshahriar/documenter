import { BaseRepository } from '@/repositories/base.repository';
import { DatabaseProvider } from '@/providers/database.provider';
import { DocumentActivity } from '@/entities/document-activity.entity';

export class DocumentActivityRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), DocumentActivity);
  }
}
