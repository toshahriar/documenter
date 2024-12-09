import { BaseRepository } from '@/repositories/base.repository';
import { DatabaseProvider } from '@/providers/database.provider';
import { DocumentSigner } from '@/entities/document-signer.entity';

export class DocumentSignerRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), DocumentSigner);
  }
}
