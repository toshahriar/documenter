import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables20241202123045 implements MigrationInterface {
  name = 'CreateTables20241202123045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE public.verification_tokens_type_enum AS ENUM ('email_verification', 'password_reset');
    `);

    await queryRunner.query(`
      CREATE TYPE public.document_status_enum AS ENUM ('completed', 'correct', 'created', 'declined', 'deleted', 'delivered', 'sent', 'signed', 'template', 'timedout', 'voided', 'updated', 'pending', 'viewed', 'rejected');
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_users" PRIMARY KEY,
        first_name varchar,
        last_name varchar,
        username varchar CONSTRAINT "uk_users_username" UNIQUE,
        email varchar NOT NULL CONSTRAINT "uk_users_email" UNIQUE,
        password varchar NOT NULL,
        is_verified boolean DEFAULT false NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.auth_tokens (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_auth_tokens" PRIMARY KEY,
        access_token varchar NOT NULL CONSTRAINT "uk_auth_tokens_access_token" UNIQUE,
        access_token_expires_at timestamp with time zone NOT NULL,
        refresh_token varchar NOT NULL CONSTRAINT "uk_auth_tokens_refresh_token" UNIQUE,
        refresh_token_expires_at timestamp with time zone NOT NULL,
        user_id uuid NOT NULL,
        is_revoked boolean DEFAULT false NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_auth_tokens_users" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.verification_tokens (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_verification_tokens" PRIMARY KEY,
        token varchar NOT NULL CONSTRAINT "uk_verification_tokens_token" UNIQUE,
        type public.verification_tokens_type_enum DEFAULT 'email_verification' NOT NULL,
        expires_at timestamp with time zone NOT NULL,
        user_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_verification_tokens_users" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.docusign_integrations (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_docusign_integrations" PRIMARY KEY,
        metadata json,
        user_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_docusign_integrations_users" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.documents (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_documents" PRIMARY KEY,
        title varchar NOT NULL,
        metadata json,
        user_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_documents_users" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.document_signers (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_document_signers" PRIMARY KEY,
        name varchar NOT NULL,
        email varchar NOT NULL,
        "order" integer NOT NULL,
        status public.document_status_enum DEFAULT 'pending' NOT NULL,
        metadata json,
        document_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_document_signers_documents" FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.document_activities (
        id uuid DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "pk_document_activities" PRIMARY KEY,
        status public.document_status_enum NOT NULL,
        metadata json,
        document_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "fk_document_activities_documents" FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.document_activities`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.document_signers`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.documents`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.docusign_integrations`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.verification_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.auth_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.users`);

    await queryRunner.query(`DROP TYPE IF EXISTS public.verification_tokens_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS public.document_status_enum`);
  }
}
