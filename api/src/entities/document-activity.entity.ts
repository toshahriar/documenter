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

@Entity('document_activities')
export class DocumentActivity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: DocumentStatus })
  status!: DocumentStatus;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @Column({ name: 'document_id', type: 'varchar' })
  documentId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @ManyToOne(() => Document, (document) => document.activities)
  @JoinColumn({ name: 'document_id' })
  document!: Document;
}
