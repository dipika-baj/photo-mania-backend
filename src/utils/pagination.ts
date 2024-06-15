export interface Pagination {
  count: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export function getPagination({
  count,
  page,
  pageSize,
}: {
  count: number;
  page: number;
  pageSize: number;
}): Pagination {
  return {
    count,
    totalPages: Math.ceil(count / pageSize),
    page,
    pageSize,
  };
}
