import { DocusignIntegrationRepository } from '@/repositories/docusign-integration.repository';
import { DocusignIntegration } from '@/entities/docusign-integration.entity';

export class DocusignIntegrationService {
  constructor(
    private readonly docusignIntegrationRepository: DocusignIntegrationRepository = new DocusignIntegrationRepository()
  ) {}

  async getByUserId(userId: string): Promise<DocusignIntegration> {
    return this.docusignIntegrationRepository.findBy({
      where: { userId },
    });
  }

  async saveOrUpdate(
    userId: string,
    integrationData: Partial<DocusignIntegration>
  ): Promise<DocusignIntegration> {
    const existingIntegration = await this.docusignIntegrationRepository.findBy({
      where: { userId },
    });

    if (existingIntegration) {
      return this.docusignIntegrationRepository.update({ where: { userId } }, integrationData);
    } else {
      return this.docusignIntegrationRepository.save({
        ...integrationData,
        userId,
      });
    }
  }
}
