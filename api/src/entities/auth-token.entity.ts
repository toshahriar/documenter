import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'access_token', type: 'varchar', unique: true })
  accessToken!: string;

  @Column({ name: 'access_token_expires_at', type: 'timestamp with time zone' })
  accessTokenExpiresAt!: Date;

  @Column({ name: 'refresh_token', type: 'varchar', unique: true })
  refreshToken!: string;

  @Column({ name: 'refresh_token_expires_at', type: 'timestamp with time zone' })
  refreshTokenExpiresAt!: Date;

  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  isRevoked!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
