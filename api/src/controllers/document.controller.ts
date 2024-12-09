import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';
import { Responder } from '@/core/utils/responder';
import { HttpStatus } from '@/core/enums/http-status.enum';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { Document } from '@/entities/document.entity';
import { DocumentSigner } from '@/entities/document-signer.entity';
import { FileService } from '@/services/file.service';
import { UploadedFile } from 'express-fileupload';
import { DocusignService } from '@/services/docusign.service';
import { DocumentStatus } from '@/core/enums/document-status.enum';
import { parseRequestBody } from '@/core/utils/common';
import { DocumentActivityRepository } from '@/repositories/document-activity.repository';

export class DocumentController {
  constructor(
    private documentService: DocumentService = new DocumentService(),
    private fileService: FileService = new FileService(),
    private docusignService: DocusignService = new DocusignService(),
    private documentActivityRepository: DocumentActivityRepository = new DocumentActivityRepository()
  ) {}

  all = async (req: Request, res: Response): Promise<Response> => {
    const options = req.query ?? {};
    const data = await this.documentService.getByUserId(req.user.id, options);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Retrieved all documents.')
      .data(data)
      .send();
  };

  analytic = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.documentService.getAnalyticsByUserId(req.user.id);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Retrieved all documents.')
      .data(data)
      .send();
  };

  store = async (req: Request, res: Response): Promise<Response> => {
    let attachment = null;

    if (req.files?.file) {
      attachment = await this.fileService.upload(req.files.file as UploadedFile);
    }

    const document = parseRequestBody(req.body);

    const documentData: Partial<Document> = {
      title: document.title,
      userId: req.user.id,
      metadata: {
        attachment,
        status: DocumentStatus.CREATED,
      },
    };

    const signersData: Partial<DocumentSigner[]> = document.signers;

    const data = await this.documentService.createDocumentWithSigners(documentData, signersData);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.CREATED)
      .message('Document created successfully.')
      .data(data)
      .notify()
      .send();
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const data = await this.documentService.findById(id);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Retrieved document.')
      .data(data)
      .send();
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    let attachment = null;

    if (req.files?.file) {
      attachment = await this.fileService.upload(req.files.file as UploadedFile);
    }

    const { id } = req.params;
    const document = parseRequestBody(req.body);

    const documentData: Partial<Document> = {
      title: document.title,
      ...(attachment ? { metadata: { attachment } } : {}),
    };

    const signersData: Partial<DocumentSigner[]> = document.signers;

    const existingDocument = await this.documentService.findById(id);

    if (req.files?.file && existingDocument.metadata?.attachment?.filePath) {
      await this.fileService.delete(existingDocument.metadata.attachment.filePath);
    }

    const data = await this.documentService.updateDocumentWithSigners(
      id,
      documentData,
      signersData
    );

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Document updated successfully.')
      .data(data)
      .notify()
      .send();
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const data = await this.documentService.findById(id);

    if (data.metadata?.attachment?.filePath) {
      await this.fileService.delete(data.metadata.attachment.filePath);
    }

    await this.documentService.delete(id);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Document deleted successfully.')
      .notify()
      .send();
  };

  send = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const document = await this.documentService.findById(id);

    const data = await this.docusignService.sendEnvelope(document);

    await this.documentService.updateDocumentMetadata(document, {
      ...data,
      status: DocumentStatus.SENT,
    });

    await this.documentActivityRepository.save({
      documentId: document.id,
      status: data.status,
      userId: req.user.id,
      metadata: {
        message: `Document is sent to DocuSign. Envelope ID is: '${data.envelopeId}'`,
      },
    });

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Document sent successfully.')
      .notify()
      .send();
  };
}
