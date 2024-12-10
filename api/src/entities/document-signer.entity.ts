import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from '@/entities/document.entity';
import { DocumentStatus } from '@/core/enums/document-status.enum';

@Entity('document_signers')
export class DocumentSigner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'varchar' })
  name!: string;

  @Column({ name: 'email', type: 'varchar' })
  email!: string;

  @Column({ name: 'designation', type: 'varchar' })
  designation!: string;

  @Column({ name: 'order', type: 'int' })
  order!: number;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status!: DocumentStatus;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @Column({ name: 'document_id', type: 'uuid' })
  documentId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @ManyToOne(() => Document, (document) => document.signers)
  @JoinColumn({ name: 'document_id' })
  document!: Document;
}
