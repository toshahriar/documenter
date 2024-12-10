import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '@/entities/user.entity';
import { Document } from '@/entities/document.entity';
import { DatabaseProvider } from '@/providers/database.provider';
import { DocumentStatus } from '@/core/enums/document-status.enum';
import { DocumentSigner } from '@/entities/document-signer.entity';
import { DocumentActivity } from '@/entities/document-activity.entity';

class DocumentSeeder {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = DatabaseProvider.getInstance();
  }

  private async truncateData(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tables = ['document_activities', 'document_signers', 'documents', 'users'];

      for (const table of tables) {
        await queryRunner.query(`TRUNCATE TABLE ${table} CASCADE;`);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createUser(): Promise<User> {
    const user = this.dataSource.manager.create(User, {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@documenter.io',
      password: 'p@ssword',
      isVerified: true,
    });
    return await this.dataSource.manager.save(user);
  }

  private async createDocument(userId: string): Promise<Document> {
    const documentTypes = ['Contract', 'Agreement', 'Proposal', 'Invoice', 'NDA'];
    const document = this.dataSource.manager.create(Document, {
      title: `${faker.helpers.arrayElement(documentTypes)} - ${faker.company.name()}`,
      metadata: {
        attachment: null,
        status: DocumentStatus.CREATED,
      },
      userId,
    });
    return await this.dataSource.manager.save(document);
  }

  private generateSignerEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
    return faker.internet
      .email({
        provider: faker.helpers.arrayElement(domains),
      })
      .toLowerCase();
  }

  private async createSigners(documentId: string, count: number): Promise<DocumentSigner[]> {
    const statuses = [
      { status: DocumentStatus.SIGNED, weight: 0.4 },
      { status: DocumentStatus.PENDING, weight: 0.4 },
      { status: DocumentStatus.REJECTED, weight: 0.2 },
    ];

    const getWeightedStatus = () => {
      const random = Math.random();
      let sum = 0;
      for (const { status, weight } of statuses) {
        sum += weight;
        if (random <= sum) return status;
      }
      return DocumentStatus.PENDING;
    };

    const signers = Array.from({ length: count }).map((_, index) => {
      const status = getWeightedStatus();
      return this.dataSource.manager.create(DocumentSigner, {
        name: faker.person.fullName(),
        designation: 'Test',
        email: this.generateSignerEmail(),
        order: index + 1,
        status,
        metadata: {
          status: DocumentStatus.SENT,
        },
        documentId,
      });
    });

    return await this.dataSource.manager.save(signers);
  }

  private async createActivities(documentId: string, signers: DocumentSigner[]): Promise<void> {
    const activities: DocumentActivity[] = [];

    activities.push(
      this.dataSource.manager.create(DocumentActivity, {
        documentId,
        status: DocumentStatus.CREATED,
        metadata: {
          message: 'Document created',
          status: DocumentStatus.CREATED,
        },
      })
    );

    activities.sort(
      (a, b) =>
        new Date(a.metadata.signedAt || a.createdAt).getTime() -
        new Date(b.metadata.signedAt || b.createdAt).getTime()
    );

    await this.dataSource.manager.save(activities);
  }

  private async createDocumentWithRelations(userId: string): Promise<void> {
    const document = await this.createDocument(userId);
    const signerCount = faker.number.int({ min: 1, max: 5 });
    const signers = await this.createSigners(document.id, signerCount);
    await this.createActivities(document.id, signers);
  }

  public async seed(): Promise<void> {
    try {
      await this.truncateData();
      console.log('Tables truncated successfully!');

      const user = await this.createUser();
      console.log('User created successfully!');

      const documentCount = faker.number.int({ min: 5, max: 10 });
      console.log(`Creating ${documentCount} documents with relations...`);

      for (let i = 0; i < documentCount; i++) {
        await this.createDocumentWithRelations(user.id);
        process.stdout.write('.');
      }

      console.log('\nSeeding completed successfully!');
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }
}

(async () => {
  try {
    config();
    await DatabaseProvider.initialize();
    const seeder = new DocumentSeeder();
    await seeder.seed();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
})();
