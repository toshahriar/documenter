import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerificationTokenType } from '@/core/enums/verification-token-type.enum';

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'token', type: 'varchar', unique: true })
  token!: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: VerificationTokenType,
    default: VerificationTokenType.EMAIL_VERIFICATION,
  })
  type!: VerificationTokenType;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt!: Date;

  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
