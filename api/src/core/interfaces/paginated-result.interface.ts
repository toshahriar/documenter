import { PaginationMeta } from '@/core/interfaces/pagination-meta.interface';

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
