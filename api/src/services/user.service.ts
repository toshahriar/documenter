import { UserRepository } from '@/repositories/user.repository';
import { User } from '@/entities/user.entity';
import { NotFoundError, UnprocessableEntityError } from '@/core/exceptions';

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async createUser(data: Partial<User>): Promise<User> {
    const validationErrors: Record<string, string> = {};

    const isEmailTaken = await this.userRepository.isEmailTaken(data.email);
    if (isEmailTaken) {
      validationErrors.email = 'Email already taken';
    }

    const isUsernameTaken = await this.userRepository.isUsernameTaken(data.username as string);
    if (isUsernameTaken) {
      validationErrors.username = 'Username is already taken';
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new UnprocessableEntityError(
        UserService.name,
        'Registration data is not valid',
        validationErrors
      );
    }

    return this.userRepository.save(data);
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findBy({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(UserService.name, 'User not found');
    }

    return user;
  }

  async findUserByEmailOrUsername(identifier: string): Promise<User> {
    const user = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      throw new NotFoundError(UserService.name, 'User not found');
    }

    return user;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const validationErrors: Record<string, string> = {};

    const isEmailTaken = await this.userRepository.isEmailTaken(updateData.email, userId);
    if (isEmailTaken) {
      validationErrors.email = 'Email already taken';
    }

    const isUsernameTaken = await this.userRepository.isUsernameTaken(
      updateData.username as string,
      userId
    );
    if (isUsernameTaken) {
      validationErrors.username = 'Username is already taken';
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new UnprocessableEntityError(
        UserService.name,
        'Registration data is not valid',
        validationErrors
      );
    }

    const user = await this.findUserById(userId);

    Object.assign(user, updateData);

    return this.userRepository.save(user);
  }

  async markEmailAsVerified(userId: string): Promise<User> {
    return this.userRepository.markAsVerified(userId);
  }
}
