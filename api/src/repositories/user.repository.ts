import { FindOptionsWhere, Not } from 'typeorm';
import { BaseRepository } from '@/repositories/base.repository';
import { User } from '@/entities/user.entity';
import { DatabaseProvider } from '@/providers/database.provider';

export class UserRepository extends BaseRepository {
  constructor() {
    super(DatabaseProvider.getInstance(), User);
  }

  async isEmailTaken(email?: string, excludeUserId?: string): Promise<boolean> {
    if (!email) return false;

    const where: FindOptionsWhere<User> = { email };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    return this.exists(where);
  }

  async isUsernameTaken(username?: string, excludeUserId?: string): Promise<boolean> {
    if (!username) return false;

    const where: FindOptionsWhere<User> = { username };

    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    return this.exists(where);
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.findBy({
      where: [{ email: identifier }, { username: identifier }],
    });
  }

  async isVerified(userId: string): Promise<boolean> {
    const user = await this.findBy({
      where: { id: userId },
      select: ['isVerified'],
    });

    return user?.isVerified ?? false;
  }

  async markAsVerified(userId: string): Promise<User> {
    return this.update({ where: { id: userId } }, { isVerified: true });
  }

  async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }
}
