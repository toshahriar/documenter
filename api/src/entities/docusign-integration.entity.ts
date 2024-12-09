import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('docusign_integrations')
export class DocusignIntegration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
