import { ILike, JsonContains } from 'typeorm';
import { Document } from '@/entities/document.entity';
import { DocumentSigner } from '@/entities/document-signer.entity';
import { DocumentStatus } from '@/core/enums/document-status.enum';
import { DocumentRepository } from '@/repositories/document.repository';
import { DocumentSignerRepository } from '@/repositories/document-signer.repository';
import { DocumentActivityRepository } from '@/repositories/document-activity.repository';

export class DocumentService {
  constructor(
    private documentRepository: DocumentRepository = new DocumentRepository(),
    private documentSignerRepository: DocumentSignerRepository = new DocumentSignerRepository(),
    private documentActivityRepository: DocumentActivityRepository = new DocumentActivityRepository()
  ) {}

  getByUserId(userId: string, options: any = {}): Promise<Document[]> {
    return this.documentRepository.getAll({
      where: {
        userId,
        ...(options.search ? { title: ILike(`%${options.search}%`) } : {}),
        ...(options.status ? { metadata: JsonContains({ status: options.status }) } : {}),
      },
      relations: ['signers', 'activities'],
    });
  }

  findById(id: string): Promise<Document> {
    return this.documentRepository.findByOrFail({
      where: { id },
      relations: ['signers', 'activities'],
    });
  }

  getAnalyticsByUserId(userId: string): Promise<any> {
    return this.documentRepository.rawQuery(
      `
      SELECT
          COUNT(*) AS total,
          COUNT(CASE WHEN metadata->>'status' = 'sent' THEN 1 END) AS total_sent,
          COUNT(CASE WHEN metadata->>'status' = 'signed' THEN 1 END) AS total_signed,
          COUNT(CASE WHEN metadata->>'status' = 'declined' THEN 1 END) AS total_declined,
          COUNT(CASE WHEN metadata->>'status' = 'completed' THEN 1 END) AS total_completed
      FROM documents
      WHERE user_id = $1
    `,
      [userId],
      false
    );
  }

  async createDocumentWithSigners(
    documentData: Partial<Document>,
    signersData: Partial<DocumentSigner[]>
  ): Promise<Document> {
    const document = await this.documentRepository.save(documentData);

    const signers = signersData.map((signer) => ({
      ...signer,
      document,
    }));

    document.signers = await this.documentSignerRepository.save(signers);

    await this.documentActivityRepository.save({
      documentId: document.id,
      status: documentData?.metadata?.status ?? DocumentStatus.CREATED,
      userId: documentData.userId,
      metadata: {
        message: `Document created with ${signers.length} signers`,
      },
    });

    return document;
  }

  async updateDocumentWithSigners(
    documentId: string,
    documentData: Partial<Document>,
    signersData: Partial<DocumentSigner[]>
  ): Promise<Document> {
    await this.documentSignerRepository.deleteMany({ where: { documentId } });

    const document = await this.documentRepository.findByOrFail({
      where: { id: documentId },
      relations: ['signers'],
    });

    const updatedMetadata = {
      ...document.metadata,
      ...documentData.metadata,
      status: documentData.metadata?.status || document.metadata?.status || DocumentStatus.CREATED,
    };

    Object.assign(document, { ...documentData, metadata: updatedMetadata });

    await this.documentRepository.save(document);

    const signersToSave = signersData.map((signer) => ({
      ...signer,
      documentId: document.id,
    }));

    document.signers = await this.documentSignerRepository.save(signersToSave);

    await this.documentActivityRepository.save({
      documentId: document.id,
      status: document.metadata.status,
      userId: documentData.userId,
      metadata: {
        message: `Document updated with ${document.signers.length} signers`,
      },
    });

    return document;
  }

  async updateDocumentMetadata(document: Document, metadata: Partial<any>): Promise<Document> {
    document.metadata = {
      ...document.metadata,
      ...metadata,
      status: metadata?.status || document.metadata?.status || DocumentStatus.CREATED,
    };

    return this.documentRepository.save(document);
  }

  async delete(documentId: string, soft = false): Promise<any> {
    return await this.documentRepository.delete({
      where: { id: documentId },
    });
  }
}
