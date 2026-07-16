import { Request } from "express";

export interface PaginationQuery {
  page: number;
  pageSize: number;
  offset: number;
  search?: string;
  isActive?: boolean;
}

export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10));
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  let isActive: boolean | undefined;
  if (req.query.isActive === "true") isActive = true;
  if (req.query.isActive === "false") isActive = false;

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    search: search || undefined,
    isActive,
  };
}

export function paginatedResponse<T>(data: T[], totalItems: number, page: number, pageSize: number) {
  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
    },
  };
}
