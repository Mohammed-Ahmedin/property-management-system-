export interface MutationSuccessResponse {
  message: string;
  success: boolean;
}

export interface DefaultQueryResponse<T> {
  data: T;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasMore: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
  sort: { field: string; direction: "asc" | "desc" };
  filters: any;
}

export interface FilterParamsInput<T> {
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  filters: T | null;
}
