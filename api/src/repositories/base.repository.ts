/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationOptions } from '@/core/interfaces/pagination-options.interface';
import { PaginatedResult } from '@/core/interfaces/paginated-result.interface';
import { DatabaseError } from '@/core/exceptions';

export abstract class BaseRepository {
  protected readonly repository: Repository<any>;

  protected constructor(
    protected readonly dataSource: DataSource,
    protected readonly entity: EntityTarget<any>
  ) {
    this.repository = this.dataSource.getRepository(this.entity);
  }

  private handleError(action: string, error: unknown): never {
    const message = `Error during ${action} operation: ${(error as Error).message}`;
    throw new DatabaseError(BaseRepository.name, message, error as Error);
  }

  async getAll(options: FindManyOptions<any> = {}): Promise<any[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      this.handleError('getAll', error);
    }
  }

  async getPaginated(
    options: FindManyOptions<any> = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    try {
      const { page = 1, pageSize = 10 } = paginationOptions;

      const take = Math.min(Math.max(pageSize, 1), 100);
      const skip = (page - 1) * take;

      const [data, total] = await this.repository.findAndCount({
        ...options,
        skip,
        take,
      });

      return {
        data,
        meta: {
          total,
          page,
          pageSize: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      this.handleError('getPaginated', error);
    }
  }

  async findBy(options: FindOneOptions<any>): Promise<any | null> {
    try {
      return await this.repository.findOne(options);
    } catch (error) {
      this.handleError('findBy', error);
    }
  }

  async findByOrFail(options: FindOneOptions<any>): Promise<any> {
    try {
      const entity = await this.findBy(options);

      if (!entity) {
        throw new Error('Entity not found');
      }

      return entity;
    } catch (error) {
      this.handleError('findByOrFail', error);
    }
  }

  async create(data: DeepPartial<any>): Promise<any> {
    try {
      return this.repository.create(data);
    } catch (error) {
      this.handleError('create', error);
    }
  }

  async save(data: DeepPartial<any>): Promise<any> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      this.handleError('save', error);
    }
  }

  async batchSave(data: DeepPartial<any>[]): Promise<any[]> {
    try {
      const entities = this.repository.create(data);
      return await this.repository.save(entities);
    } catch (error) {
      this.handleError('batchSave', error);
    }
  }

  async update(options: FindOneOptions<any>, data: any): Promise<any> {
    try {
      const entity = await this.findByOrFail(options);
      this.repository.merge(entity, data);
      return await this.repository.save(entity);
    } catch (error) {
      this.handleError('update', error);
    }
  }

  async batchUpdate(options: FindManyOptions, data: DeepPartial<any>): Promise<any[]> {
    try {
      const entities = await this.repository.find(options);
      const updatedEntities = entities.map((entity) => this.repository.merge(entity, data));
      return await this.repository.save(updatedEntities);
    } catch (error) {
      this.handleError('batchUpdate', error);
    }
  }

  async delete(options: FindOneOptions<any>, soft = false): Promise<void> {
    try {
      const entity = await this.findByOrFail(options);

      if (soft && entity && 'deletedAt' in entity) {
        await this.repository.update(entity.id, { deletedAt: new Date() });
      } else {
        await this.repository.remove(entity);
      }
    } catch (error) {
      this.handleError('delete', error);
    }
  }

  async deleteMany(options: FindManyOptions<any>, soft = false): Promise<void> {
    try {
      const entities = await this.repository.find(options);

      if (entities.length === 0) {
        return;
      }

      if (soft && 'deletedAt' in entities[0]) {
        const ids = entities.map((entity) => entity.id);
        await this.repository.update(ids, { deletedAt: new Date() });
      } else {
        await this.repository.remove(entities);
      }
    } catch (error) {
      this.handleError('deleteMany', error);
    }
  }

  async query<R = any[]>(
    qb: (queryBuilder: SelectQueryBuilder<any>) => void,
    returnMany = true
  ): Promise<R> {
    try {
      const queryBuilder = this.repository.createQueryBuilder();

      qb(queryBuilder);

      return returnMany
        ? ((await queryBuilder.getMany()) as R)
        : ((await queryBuilder.getOne()) as R);
    } catch (error) {
      this.handleError('query', error);
    }
  }

  async rawQuery<R = any[]>(sql: string, parameters: any[] = [], returnMany = true): Promise<R> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      const result = await queryRunner.query(sql, parameters);
      return returnMany ? (result as R) : (result[0] as R);
    } catch (error) {
      this.handleError('rawQuery', error);
    } finally {
      await queryRunner.release();
    }
  }
}
