import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DocumentActivity } from '@/entities/document-activity.entity';
import { DocumentSigner } from '@/entities/document-signer.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'title', type: 'varchar' })
  title!: string;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @OneToMany(() => DocumentActivity, (activity) => activity.document)
  activities!: DocumentActivity[];

  @OneToMany(() => DocumentSigner, (signer) => signer.document)
  signers!: DocumentSigner[];
}
