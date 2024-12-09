import { BaseRepository } from '@/repositories/base.repository';
import { Document } from '@/entities/document.entity';
import { DatabaseProvider } from '@/providers/database.provider';

export class DocumentRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), Document);
  }
}
